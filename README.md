### Installation

- Deno: `deno add jsr:@9h/wav`
- npm: `npx jsr add @9h/wav`
- for other platforms see [https://jsr.io/@9h/wav](https://jsr.io/@9h/wav)

### Example

```typescript
import { WavWriter } from "@9h/wav";

const sampleRate = 48000;
const lengthSeconds = 1;
const numSamples = sampleRate * lengthSeconds;
const numChannels = 1;

const startFreq = 1000;
const endFreq = 200;
const delta = (endFreq - startFreq) / numSamples;

let currentFreq = startFreq;
let phase = 0;
const samples = new Float32Array(numSamples);

for (let i = 0; i < numSamples; i++) {
    samples[i] = Math.sin(phase);
    phase += (2 * Math.PI * currentFreq) / sampleRate;
    currentFreq += delta;
}

const writer = new WavWriter(sampleRate, numChannels);
const wav = writer.toWavBuffer(samples);

await Deno.writeFile("sine_chirp.wav", wav);
```
