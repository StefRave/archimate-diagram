export class Base64 {
  public static fromUint8Array(data: Uint8Array): string {
    return btoa(Base64.uint8ToString(data));
  }

  public static toArrayBuffer(base64: string): Uint8Array {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++)
        bytes[i] = binary_string.charCodeAt(i);
    return bytes;
  }

  private static uint8ToString(u8a: Uint8Array) { // https://stackoverflow.com/a/12713326
    const CHUNK_SZ = 0x8000;
    const c = [];
    for (let i = 0; i < u8a.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
  }
} 
