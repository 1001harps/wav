export class WavWriter {
  sampleRate: number;
  numChannels: number;

  constructor(sampleRate = 48000, numChannels = 1) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
  }

  private writeStringToBuffer = (
    view: DataView,
    offset: number,
    str: string
  ) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // only support float32 for now
  toWavBuffer(samples: Float32Array): Uint8Array {
    const blockAlign = this.numChannels * 4; // float32 is 4 bytes / sample
    const byteRate = this.sampleRate * blockAlign;
    const dataSize = samples.length * 4;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    let offset = 0;

    // "RIFF"
    this.writeStringToBuffer(view, offset, "RIFF");
    offset += 4;
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    this.writeStringToBuffer(view, offset, "WAVE");
    offset += 4;

    // "fmt " chunk
    this.writeStringToBuffer(view, offset, "fmt ");
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4; // chunk size
    view.setUint16(offset, 3, true);
    offset += 2; // format = 3 (IEEE float)
    view.setUint16(offset, this.numChannels, true);
    offset += 2;
    view.setUint32(offset, this.sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, 32, true);
    offset += 2; // bits per sample

    // "data" chunk
    this.writeStringToBuffer(view, offset, "data");
    offset += 4;
    view.setUint32(offset, dataSize, true);
    offset += 4;

    // samples
    const f32 = new Float32Array(buffer, offset, samples.length);
    f32.set(samples);

    return new Uint8Array(buffer);
  }
}
