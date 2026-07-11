/**
 * Records microphone audio as raw PCM and encodes it as a 16-bit WAV blob —
 * avoids relying on MediaRecorder's codec (webm/opus), which llama.cpp's
 * audio input does not accept. Format sent to the backend is always `wav`.
 */
export interface AudioRecording {
  blob: Blob;
  dataUrl: string;
  durationSec: number;
}

export class AudioRecorder {
  private audioContext?: AudioContext;
  private sourceNode?: MediaStreamAudioSourceNode;
  private processorNode?: ScriptProcessorNode;
  private analyserNode?: AnalyserNode;
  private stream?: MediaStream;
  private chunks: Float32Array[] = [];
  private sampleRate = 44100;

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext();
    this.sampleRate = this.audioContext.sampleRate;
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.chunks = [];

    // Analyser is purely for the live visualiser — it taps the same source
    // in parallel with the recording processor, no effect on captured audio.
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 64;
    this.analyserNode.smoothingTimeConstant = 0.7;

    this.processorNode.onaudioprocess = (event) => {
      this.chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    };

    this.sourceNode.connect(this.analyserNode);
    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
  }

  /** Number of bars `getFrequencyData` will fill. 0 while not recording. */
  get frequencyBinCount(): number {
    return this.analyserNode?.frequencyBinCount ?? 0;
  }

  /** Fills `out` with the current frequency-magnitude snapshot (0-255 per bin), for a live bar visualiser. No-op if not recording. */
  getFrequencyData(out: Uint8Array<ArrayBuffer>): void {
    this.analyserNode?.getByteFrequencyData(out);
  }

  async stop(): Promise<AudioRecording> {
    this.processorNode?.disconnect();
    this.sourceNode?.disconnect();
    this.analyserNode?.disconnect();
    this.analyserNode = undefined;
    this.stream?.getTracks().forEach((t) => t.stop());
    await this.audioContext?.close();

    const totalLength = this.chunks.reduce((sum, c) => sum + c.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const blob = encodeWav(merged, this.sampleRate);
    const dataUrl = await blobToDataUrl(blob);
    const durationSec = this.sampleRate ? totalLength / this.sampleRate : 0;

    return { blob, dataUrl, durationSec };
  }
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * bytesPerSample, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
