import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ChatCompletionDeveloperMessageParamDto } from './ChatCompletionDeveloperMessageParamDto';
import { ChatCompletionSystemMessageParamDto } from './ChatCompletionSystemMessageParamDto';
import { ChatCompletionUserMessageParamDto } from './ChatCompletionUserMessageParamDto';
import { ChatCompletionAssistantMessageParamDto } from './ChatCompletionAssistantMessageParamDto';
import { ChatCompletionToolMessageParamDto } from './ChatCompletionToolMessageParamDto';
import { ChatCompletionFunctionMessageParamDto } from './ChatCompletionFunctionMessageParamDto';
import { _Inline_0Dto } from './_Inline_0Dto';
import { ChatCompletionAudioParamDto } from './ChatCompletionAudioParamDto';
import { ChatCompletionFunctionCallOptionDto } from './ChatCompletionFunctionCallOptionDto';
import { _Inline_u05lxdDto } from './_Inline_u05lxdDto';
import { ChatCompletionPredictionContentDto } from './ChatCompletionPredictionContentDto';
import { ResponseFormatTextDto } from './ResponseFormatTextDto';
import { ResponseFormatJSONSchemaDto } from './ResponseFormatJSONSchemaDto';
import { ResponseFormatJSONObjectDto } from './ResponseFormatJSONObjectDto';
import { ChatCompletionStreamOptionsDto } from './ChatCompletionStreamOptionsDto';
import { ChatCompletionAllowedToolChoiceDto } from './ChatCompletionAllowedToolChoiceDto';
import { ChatCompletionNamedToolChoiceDto } from './ChatCompletionNamedToolChoiceDto';
import { ChatCompletionNamedToolChoiceCustomDto } from './ChatCompletionNamedToolChoiceCustomDto';
import { ChatCompletionFunctionToolDto } from './ChatCompletionFunctionToolDto';
import { ChatCompletionCustomToolDto } from './ChatCompletionCustomToolDto';
import { WebSearchOptionsDto } from './WebSearchOptionsDto';
import { ReasoningEffort } from '../custom/reasoning_effort';

@ApiExtraModels(
  ChatCompletionDeveloperMessageParamDto,
  ChatCompletionSystemMessageParamDto,
  ChatCompletionUserMessageParamDto,
  ChatCompletionAssistantMessageParamDto,
  ChatCompletionToolMessageParamDto,
  ChatCompletionFunctionMessageParamDto,
  _Inline_0Dto,
  ChatCompletionAudioParamDto,
  ChatCompletionFunctionCallOptionDto,
  ChatCompletionPredictionContentDto,
  ResponseFormatTextDto,
  ResponseFormatJSONSchemaDto,
  ResponseFormatJSONObjectDto,
  ChatCompletionStreamOptionsDto,
  ChatCompletionAllowedToolChoiceDto,
  ChatCompletionNamedToolChoiceDto,
  ChatCompletionNamedToolChoiceCustomDto,
  ChatCompletionFunctionToolDto,
  ChatCompletionCustomToolDto,
)
export class ChatCompletionCreateParamsStreamingDto {
  /**
   * A list of messages comprising the conversation so far. Depending on the
   * [model](https://platform.openai.com/docs/models) you use, different message
   * types (modalities) are supported, like
   * [text](https://platform.openai.com/docs/guides/text-generation),
   * [images](https://platform.openai.com/docs/guides/vision), and
   * [audio](https://platform.openai.com/docs/guides/audio).
   */
  @ApiProperty({
    description: `A list of messages comprising the conversation so far. Depending on the
  [model](https://platform.openai.com/docs/models) you use, different message
  types (modalities) are supported, like
  [text](https://platform.openai.com/docs/guides/text-generation),
  [images](https://platform.openai.com/docs/guides/vision), and
  [audio](https://platform.openai.com/docs/guides/audio).`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(ChatCompletionDeveloperMessageParamDto) },
      { $ref: getSchemaPath(ChatCompletionSystemMessageParamDto) },
      { $ref: getSchemaPath(ChatCompletionUserMessageParamDto) },
      { $ref: getSchemaPath(ChatCompletionAssistantMessageParamDto) },
      { $ref: getSchemaPath(ChatCompletionToolMessageParamDto) },
      { $ref: getSchemaPath(ChatCompletionFunctionMessageParamDto) },
    ],
  })
  @IsArray()
  messages!: (
    | ChatCompletionDeveloperMessageParamDto
    | ChatCompletionSystemMessageParamDto
    | ChatCompletionUserMessageParamDto
    | ChatCompletionAssistantMessageParamDto
    | ChatCompletionToolMessageParamDto
    | ChatCompletionFunctionMessageParamDto
  )[];

  /**
   * Model ID used to generate the response, like `gpt-4o` or `o3`. OpenAI offers a
   * wide range of models with different capabilities, performance characteristics,
   * and price points. Refer to the
   * [model guide](https://platform.openai.com/docs/models) to browse and compare
   * available models.
   */
  @ApiProperty({
    description: `Model ID used to generate the response, like \`gpt-4o\` or \`o3\`. OpenAI offers a
  wide range of models with different capabilities, performance characteristics,
  and price points. Refer to the
  [model guide](https://platform.openai.com/docs/models) to browse and compare
  available models.`,
    oneOf: [{ $ref: getSchemaPath(_Inline_0Dto) }, { type: 'string' }],
  })
  model!:
    | 'string'
    | 'gpt-5.4'
    | 'gpt-5.4-mini'
    | 'gpt-5.4-nano'
    | 'gpt-5.4-mini-2026-03-17'
    | 'gpt-5.4-nano-2026-03-17'
    | 'gpt-5.3-chat-latest'
    | 'gpt-5.2'
    | 'gpt-5.2-2025-12-11'
    | 'gpt-5.2-chat-latest'
    | 'gpt-5.2-pro'
    | 'gpt-5.2-pro-2025-12-11'
    | 'gpt-5.1'
    | 'gpt-5.1-2025-11-13'
    | 'gpt-5.1-codex'
    | 'gpt-5.1-mini'
    | 'gpt-5.1-chat-latest'
    | 'gpt-5'
    | 'gpt-5-mini'
    | 'gpt-5-nano'
    | 'gpt-5-2025-08-07'
    | 'gpt-5-mini-2025-08-07'
    | 'gpt-5-nano-2025-08-07'
    | 'gpt-5-chat-latest'
    | 'gpt-4.1'
    | 'gpt-4.1-mini'
    | 'gpt-4.1-nano'
    | 'gpt-4.1-2025-04-14'
    | 'gpt-4.1-mini-2025-04-14'
    | 'gpt-4.1-nano-2025-04-14'
    | 'o4-mini'
    | 'o4-mini-2025-04-16'
    | 'o3'
    | 'o3-2025-04-16'
    | 'o3-mini'
    | 'o3-mini-2025-01-31'
    | 'o1'
    | 'o1-2024-12-17'
    | 'o1-preview'
    | 'o1-preview-2024-09-12'
    | 'o1-mini'
    | 'o1-mini-2024-09-12'
    | 'gpt-4o'
    | 'gpt-4o-2024-11-20'
    | 'gpt-4o-2024-08-06'
    | 'gpt-4o-2024-05-13'
    | 'gpt-4o-audio-preview'
    | 'gpt-4o-audio-preview-2024-10-01'
    | 'gpt-4o-audio-preview-2024-12-17'
    | 'gpt-4o-audio-preview-2025-06-03'
    | 'gpt-4o-mini-audio-preview'
    | 'gpt-4o-mini-audio-preview-2024-12-17'
    | 'gpt-4o-search-preview'
    | 'gpt-4o-mini-search-preview'
    | 'gpt-4o-search-preview-2025-03-11'
    | 'gpt-4o-mini-search-preview-2025-03-11'
    | 'chatgpt-4o-latest'
    | 'codex-mini-latest'
    | 'gpt-4o-mini'
    | 'gpt-4o-mini-2024-07-18'
    | 'gpt-4-turbo'
    | 'gpt-4-turbo-2024-04-09'
    | 'gpt-4-0125-preview'
    | 'gpt-4-turbo-preview'
    | 'gpt-4-1106-preview'
    | 'gpt-4-vision-preview'
    | 'gpt-4'
    | 'gpt-4-0314'
    | 'gpt-4-0613'
    | 'gpt-4-32k'
    | 'gpt-4-32k-0314'
    | 'gpt-4-32k-0613'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-16k'
    | 'gpt-3.5-turbo-0301'
    | 'gpt-3.5-turbo-0613'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-0125'
    | 'gpt-3.5-turbo-16k-0613';

  /**
   * Parameters for audio output. Required when audio output is requested with
   * `modalities: ["audio"]`.
   * [Learn more](https://platform.openai.com/docs/guides/audio).
   */
  @ApiProperty({
    required: false,
    description: `Parameters for audio output. Required when audio output is requested with
  \`modalities: ["audio"]\`.
  [Learn more](https://platform.openai.com/docs/guides/audio).`,
    type: () => ChatCompletionAudioParamDto,
  })
  @IsOptional()
  audio?: null | ChatCompletionAudioParamDto;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   */
  @ApiProperty({
    required: false,
    description: `Number between -2.0 and 2.0. Positive values penalize new tokens based on their
  existing frequency in the text so far, decreasing the model's likelihood to
  repeat the same line verbatim.`,
    type: 'number',
  })
  @IsOptional()
  frequency_penalty?: null | number;

  @ApiProperty({
    required: false,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionFunctionCallOptionDto) },
    ],
  })
  @IsOptional()
  function_call?: 'auto' | 'none' | ChatCompletionFunctionCallOptionDto;

  @ApiProperty({
    required: false,
    type: _Inline_u05lxdDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => _Inline_u05lxdDto)
  functions?: _Inline_u05lxdDto[];

  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a JSON object that maps tokens (specified by their token ID in the
   * tokenizer) to an associated bias value from -100 to 100. Mathematically, the
   * bias is added to the logits generated by the model prior to sampling. The exact
   * effect will vary per model, but values between -1 and 1 should decrease or
   * increase likelihood of selection; values like -100 or 100 should result in a ban
   * or exclusive selection of the relevant token.
   */
  @ApiProperty({
    required: false,
    description: `Modify the likelihood of specified tokens appearing in the completion.
  
  Accepts a JSON object that maps tokens (specified by their token ID in the
  tokenizer) to an associated bias value from -100 to 100. Mathematically, the
  bias is added to the logits generated by the model prior to sampling. The exact
  effect will vary per model, but values between -1 and 1 should decrease or
  increase likelihood of selection; values like -100 or 100 should result in a ban
  or exclusive selection of the relevant token.`,
  })
  @IsOptional()
  logit_bias?: null | any;

  /**
   * Whether to return log probabilities of the output tokens or not. If true,
   * returns the log probabilities of each output token returned in the `content` of
   * `message`.
   */
  @ApiProperty({
    required: false,
    description: `Whether to return log probabilities of the output tokens or not. If true,
  returns the log probabilities of each output token returned in the \`content\` of
  \`message\`.`,
  })
  @IsOptional()
  logprobs?: null | false | true;

  /**
   * An upper bound for the number of tokens that can be generated for a completion,
   * including visible output tokens and
   * [reasoning tokens](https://platform.openai.com/docs/guides/reasoning).
   */
  @ApiProperty({
    required: false,
    description: `An upper bound for the number of tokens that can be generated for a completion,
  including visible output tokens and
  [reasoning tokens](https://platform.openai.com/docs/guides/reasoning).`,
    type: 'number',
  })
  @IsOptional()
  max_completion_tokens?: null | number;

  @ApiProperty({
    required: false,
    type: 'number',
  })
  @IsOptional()
  max_tokens?: null | number;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard.
   *
   * Keys are strings with a maximum length of 64 characters. Values are strings with
   * a maximum length of 512 characters.
   */
  @ApiProperty({
    required: false,
    description: `Set of 16 key-value pairs that can be attached to an object. This can be useful
  for storing additional information about the object in a structured format, and
  querying for objects via API or the dashboard.
  
  Keys are strings with a maximum length of 64 characters. Values are strings with
  a maximum length of 512 characters.`,
  })
  @IsOptional()
  metadata?: null | any;

  /**
   * Output types that you would like the model to generate. Most models are capable
   * of generating text, which is the default:
   *
   * `["text"]`
   *
   * The `gpt-4o-audio-preview` model can also be used to
   * [generate audio](https://platform.openai.com/docs/guides/audio). To request that
   * this model generate both text and audio responses, you can use:
   *
   * `["text", "audio"]`
   */
  @ApiProperty({
    required: false,
    description: `Output types that you would like the model to generate. Most models are capable
  of generating text, which is the default:
  
  \`["text"]\`
  
  The \`gpt-4o-audio-preview\` model can also be used to
  [generate audio](https://platform.openai.com/docs/guides/audio). To request that
  this model generate both text and audio responses, you can use:
  
  \`["text", "audio"]\``,
    isArray: true,
    enum: ['text', 'audio'],
  })
  @IsOptional()
  modalities?: null | ('text' | 'audio')[];

  /**
   * How many chat completion choices to generate for each input message. Note that
   * you will be charged based on the number of generated tokens across all of the
   * choices. Keep `n` as `1` to minimize costs.
   */
  @ApiProperty({
    required: false,
    description: `How many chat completion choices to generate for each input message. Note that
  you will be charged based on the number of generated tokens across all of the
  choices. Keep \`n\` as \`1\` to minimize costs.`,
    type: 'number',
  })
  @IsOptional()
  n?: null | number;

  /**
   * Whether to enable
   * [parallel function calling](https://platform.openai.com/docs/guides/function-calling#configuring-parallel-function-calling)
   * during tool use.
   */
  @ApiProperty({
    required: false,
    description: `Whether to enable
  [parallel function calling](https://platform.openai.com/docs/guides/function-calling#configuring-parallel-function-calling)
  during tool use.`,
  })
  @IsOptional()
  parallel_tool_calls?: false | true;

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   */
  @ApiProperty({
    required: false,
    description: `Static predicted output content, such as the content of a text file that is
  being regenerated.`,
    type: () => ChatCompletionPredictionContentDto,
  })
  @IsOptional()
  prediction?: null | ChatCompletionPredictionContentDto;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   */
  @ApiProperty({
    required: false,
    description: `Number between -2.0 and 2.0. Positive values penalize new tokens based on
  whether they appear in the text so far, increasing the model's likelihood to
  talk about new topics.`,
    type: 'number',
  })
  @IsOptional()
  presence_penalty?: null | number;

  /**
   * Used by OpenAI to cache responses for similar requests to optimize your cache
   * hit rates. Replaces the `user` field.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching).
   */
  @ApiProperty({
    required: false,
    description: `Used by OpenAI to cache responses for similar requests to optimize your cache
  hit rates. Replaces the \`user\` field.
  [Learn more](https://platform.openai.com/docs/guides/prompt-caching).`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  prompt_cache_key?: string;

  /**
   * The retention policy for the prompt cache. Set to `24h` to enable extended
   * prompt caching, which keeps cached prefixes active for longer, up to a maximum
   * of 24 hours.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).
   */
  @ApiProperty({
    required: false,
    description: `The retention policy for the prompt cache. Set to \`24h\` to enable extended
  prompt caching, which keeps cached prefixes active for longer, up to a maximum
  of 24 hours.
  [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).`,
    enum: ['in-memory', '24h'],
  })
  @IsOptional()
  @IsIn(['in-memory', '24h'])
  prompt_cache_retention?: null | 'in-memory' | '24h';

  /**
   * Constrains effort on reasoning for
   * [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently
   * supported values are `none`, `minimal`, `low`, `medium`, `high`, and `xhigh`.
   * Reducing reasoning effort can result in faster responses and fewer tokens used
   * on reasoning in a response.
   *
   * - `gpt-5.1` defaults to `none`, which does not perform reasoning. The supported
   *   reasoning values for `gpt-5.1` are `none`, `low`, `medium`, and `high`. Tool
   *   calls are supported for all reasoning values in gpt-5.1.
   * - All models before `gpt-5.1` default to `medium` reasoning effort, and do not
   *   support `none`.
   * - The `gpt-5-pro` model defaults to (and only supports) `high` reasoning effort.
   * - `xhigh` is supported for all models after `gpt-5.1-codex-max`.
   */
  @ApiProperty({
    required: false,
    enumName: 'ReasoningEffort',
    enum: ReasoningEffort,
    description: `Constrains effort on reasoning for
  [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently
  supported values are \`none\`, \`minimal\`, \`low\`, \`medium\`, \`high\`, and \`xhigh\`.
  Reducing reasoning effort can result in faster responses and fewer tokens used
  on reasoning in a response.
  
  - \`gpt-5.1\` defaults to \`none\`, which does not perform reasoning. The supported
    reasoning values for \`gpt-5.1\` are \`none\`, \`low\`, \`medium\`, and \`high\`. Tool
    calls are supported for all reasoning values in gpt-5.1.
  - All models before \`gpt-5.1\` default to \`medium\` reasoning effort, and do not
    support \`none\`.
  - The \`gpt-5-pro\` model defaults to (and only supports) \`high\` reasoning effort.
  - \`xhigh\` is supported for all models after \`gpt-5.1-codex-max\`.`,
  })
  @IsOptional()
  @IsIn(['low', 'high', 'none', 'minimal', 'medium', 'xhigh'])
  reasoning_effort?: ReasoningEffort;

  /**
   * An object specifying the format that the model must output.
   *
   * Setting to `{ "type": "json_schema", "json_schema": {...} }` enables Structured
   * Outputs which ensures the model will match your supplied JSON schema. Learn more
   * in the
   * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
   *
   * Setting to `{ "type": "json_object" }` enables the older JSON mode, which
   * ensures the message the model generates is valid JSON. Using `json_schema` is
   * preferred for models that support it.
   */
  @ApiProperty({
    required: false,
    description: `An object specifying the format that the model must output.
  
  Setting to \`{ "type": "json_schema", "json_schema": {...} }\` enables Structured
  Outputs which ensures the model will match your supplied JSON schema. Learn more
  in the
  [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
  
  Setting to \`{ "type": "json_object" }\` enables the older JSON mode, which
  ensures the message the model generates is valid JSON. Using \`json_schema\` is
  preferred for models that support it.`,
    oneOf: [
      { $ref: getSchemaPath(ResponseFormatTextDto) },
      { $ref: getSchemaPath(ResponseFormatJSONSchemaDto) },
      { $ref: getSchemaPath(ResponseFormatJSONObjectDto) },
    ],
  })
  @IsOptional()
  response_format?:
    | ResponseFormatTextDto
    | ResponseFormatJSONSchemaDto
    | ResponseFormatJSONObjectDto;

  /**
   * A stable identifier used to help detect users of your application that may be
   * violating OpenAI's usage policies. The IDs should be a string that uniquely
   * identifies each user, with a maximum length of 64 characters. We recommend
   * hashing their username or email address, in order to avoid sending us any
   * identifying information.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).
   */
  @ApiProperty({
    required: false,
    description: `A stable identifier used to help detect users of your application that may be
  violating OpenAI's usage policies. The IDs should be a string that uniquely
  identifies each user, with a maximum length of 64 characters. We recommend
  hashing their username or email address, in order to avoid sending us any
  identifying information.
  [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  safety_identifier?: string;

  @ApiProperty({
    required: false,
    type: 'number',
  })
  @IsOptional()
  seed?: null | number;

  /**
   * Specifies the processing type used for serving the request.
   *
   * - If set to 'auto', then the request will be processed with the service tier
   *   configured in the Project settings. Unless otherwise configured, the Project
   *   will use 'default'.
   * - If set to 'default', then the request will be processed with the standard
   *   pricing and performance for the selected model.
   * - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or
   *   '[priority](https://openai.com/api-priority-processing/)', then the request
   *   will be processed with the corresponding service tier.
   * - When not set, the default behavior is 'auto'.
   *
   * When the `service_tier` parameter is set, the response body will include the
   * `service_tier` value based on the processing mode actually used to serve the
   * request. This response value may be different from the value set in the
   * parameter.
   */
  @ApiProperty({
    required: false,
    description: `Specifies the processing type used for serving the request.
  
  - If set to 'auto', then the request will be processed with the service tier
    configured in the Project settings. Unless otherwise configured, the Project
    will use 'default'.
  - If set to 'default', then the request will be processed with the standard
    pricing and performance for the selected model.
  - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or
    '[priority](https://openai.com/api-priority-processing/)', then the request
    will be processed with the corresponding service tier.
  - When not set, the default behavior is 'auto'.
  
  When the \`service_tier\` parameter is set, the response body will include the
  \`service_tier\` value based on the processing mode actually used to serve the
  request. This response value may be different from the value set in the
  parameter.`,
    enum: ['auto', 'default', 'flex', 'scale', 'priority'],
  })
  @IsOptional()
  @IsIn(['auto', 'default', 'flex', 'scale', 'priority'])
  service_tier?: null | 'auto' | 'default' | 'flex' | 'scale' | 'priority';

  /**
   * Not supported with latest reasoning models `o3` and `o4-mini`.
   *
   * Up to 4 sequences where the API will stop generating further tokens. The
   * returned text will not contain the stop sequence.
   */
  @ApiProperty({
    required: false,
    description: `Not supported with latest reasoning models \`o3\` and \`o4-mini\`.
  
  Up to 4 sequences where the API will stop generating further tokens. The
  returned text will not contain the stop sequence.`,
    isArray: true,
    oneOf: [{ type: 'string' }],
  })
  @IsOptional()
  stop?: null | string | string[];

  /**
   * Whether or not to store the output of this chat completion request for use in
   * our [model distillation](https://platform.openai.com/docs/guides/distillation)
   * or [evals](https://platform.openai.com/docs/guides/evals) products.
   *
   * Supports text and image inputs. Note: image inputs over 8MB will be dropped.
   */
  @ApiProperty({
    required: false,
    description: `Whether or not to store the output of this chat completion request for use in
  our [model distillation](https://platform.openai.com/docs/guides/distillation)
  or [evals](https://platform.openai.com/docs/guides/evals) products.
  
  Supports text and image inputs. Note: image inputs over 8MB will be dropped.`,
  })
  @IsOptional()
  store?: null | false | true;

  /**
   * If set to true, the model response data will be streamed to the client as it is
   * generated using
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
   * See the
   * [Streaming section below](https://platform.openai.com/docs/api-reference/chat/streaming)
   * for more information, along with the
   * [streaming responses](https://platform.openai.com/docs/guides/streaming-responses)
   * guide for more information on how to handle the streaming events.
   */
  @ApiProperty({
    description: `If set to true, the model response data will be streamed to the client as it is
  generated using
  [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  See the
  [Streaming section below](https://platform.openai.com/docs/api-reference/chat/streaming)
  for more information, along with the
  [streaming responses](https://platform.openai.com/docs/guides/streaming-responses)
  guide for more information on how to handle the streaming events.`,
  })
  stream!: true;

  /** Options for streaming response. Only set this when you set `stream: true`. */
  @ApiProperty({
    required: false,
    description: `Options for streaming response. Only set this when you set \`stream: true\`.`,
    type: () => ChatCompletionStreamOptionsDto,
  })
  @IsOptional()
  stream_options?: null | ChatCompletionStreamOptionsDto;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic. We generally recommend altering this or `top_p` but
   * not both.
   */
  @ApiProperty({
    required: false,
    description: `What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
  make the output more random, while lower values like 0.2 will make it more
  focused and deterministic. We generally recommend altering this or \`top_p\` but
  not both.`,
    type: 'number',
  })
  @IsOptional()
  temperature?: null | number;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tool and instead generates a message. `auto` means the model can
   * pick between generating a message or calling one or more tools. `required` means
   * the model must call one or more tools. Specifying a particular tool via
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   *
   * `none` is the default when no tools are present. `auto` is the default if tools
   * are present.
   */
  @ApiProperty({
    required: false,
    description: `Controls which (if any) tool is called by the model. \`none\` means the model will
  not call any tool and instead generates a message. \`auto\` means the model can
  pick between generating a message or calling one or more tools. \`required\` means
  the model must call one or more tools. Specifying a particular tool via
  \`{"type": "function", "function": {"name": "my_function"}}\` forces the model to
  call that tool.
  
  \`none\` is the default when no tools are present. \`auto\` is the default if tools
  are present.`,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionAllowedToolChoiceDto) },
      { $ref: getSchemaPath(ChatCompletionNamedToolChoiceDto) },
      { $ref: getSchemaPath(ChatCompletionNamedToolChoiceCustomDto) },
    ],
  })
  @IsOptional()
  tool_choice?:
    | 'auto'
    | 'none'
    | 'required'
    | ChatCompletionAllowedToolChoiceDto
    | ChatCompletionNamedToolChoiceDto
    | ChatCompletionNamedToolChoiceCustomDto;

  /**
   * A list of tools the model may call. You can provide either
   * [custom tools](https://platform.openai.com/docs/guides/function-calling#custom-tools)
   * or [function tools](https://platform.openai.com/docs/guides/function-calling).
   */
  @ApiProperty({
    required: false,
    description: `A list of tools the model may call. You can provide either
  [custom tools](https://platform.openai.com/docs/guides/function-calling#custom-tools)
  or [function tools](https://platform.openai.com/docs/guides/function-calling).`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(ChatCompletionFunctionToolDto) },
      { $ref: getSchemaPath(ChatCompletionCustomToolDto) },
    ],
  })
  @IsOptional()
  @IsArray()
  tools?: (ChatCompletionFunctionToolDto | ChatCompletionCustomToolDto)[];

  /**
   * An integer between 0 and 20 specifying the number of most likely tokens to
   * return at each token position, each with an associated log probability.
   * `logprobs` must be set to `true` if this parameter is used.
   */
  @ApiProperty({
    required: false,
    description: `An integer between 0 and 20 specifying the number of most likely tokens to
  return at each token position, each with an associated log probability.
  \`logprobs\` must be set to \`true\` if this parameter is used.`,
    type: 'number',
  })
  @IsOptional()
  top_logprobs?: null | number;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   */
  @ApiProperty({
    required: false,
    description: `An alternative to sampling with temperature, called nucleus sampling, where the
  model considers the results of the tokens with top_p probability mass. So 0.1
  means only the tokens comprising the top 10% probability mass are considered.
  
  We generally recommend altering this or \`temperature\` but not both.`,
    type: 'number',
  })
  @IsOptional()
  top_p?: null | number;

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  user?: string;

  /**
   * Constrains the verbosity of the model's response. Lower values will result in
   * more concise responses, while higher values will result in more verbose
   * responses. Currently supported values are `low`, `medium`, and `high`.
   */
  @ApiProperty({
    required: false,
    description: `Constrains the verbosity of the model's response. Lower values will result in
  more concise responses, while higher values will result in more verbose
  responses. Currently supported values are \`low\`, \`medium\`, and \`high\`.`,
    enum: ['low', 'high', 'medium'],
  })
  @IsOptional()
  @IsIn(['low', 'high', 'medium'])
  verbosity?: null | 'low' | 'high' | 'medium';

  /**
   * This tool searches the web for relevant results to use in a response. Learn more
   * about the
   * [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat).
   */
  @ApiProperty({
    required: false,
    description: `This tool searches the web for relevant results to use in a response. Learn more
  about the
  [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat).`,
    type: () => WebSearchOptionsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => WebSearchOptionsDto)
  web_search_options?: WebSearchOptionsDto;
}
