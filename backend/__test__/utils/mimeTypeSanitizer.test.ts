/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {sanitizeMimeType} from "../../src/utils/mimeTypeSanitizer";
import {describe, expect, it} from "@jest/globals";


describe("mimeTypeSanitizer", () => {
  it("should handle empty string correctly", () => {
    expect(sanitizeMimeType('')).toBe("dat");
  });

  it("should handle unrecognized string correctly", () => {
    expect(sanitizeMimeType('test')).toBe("dat");
  });
})

