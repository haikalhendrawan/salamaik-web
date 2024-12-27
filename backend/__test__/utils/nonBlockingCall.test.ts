import {describe, expect, it} from "@jest/globals";
import nonBlockingCall from "../../src/utils/nonBlockingCall";


describe("nonBlockingCall", () => {
  it("should not block other main function", () => {
    const promise = new Promise((resolve, reject) => {});
    nonBlockingCall(promise);
    expect(true).toBe(true);
  });
})