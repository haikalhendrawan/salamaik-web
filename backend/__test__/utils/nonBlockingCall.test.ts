import {describe, expect, it} from "@jest/globals";
import nonBlockingCall from "../../src/utils/nonBlockingCall";


describe("nonBlockingCall", () => {
  it("should not block other main function", () => {
    const promise = new Promise((_, reject) => {reject("error")});
    nonBlockingCall(promise, "expected error will be logged to console but should not block main function");
    expect(true).toBe(true);
  });
})