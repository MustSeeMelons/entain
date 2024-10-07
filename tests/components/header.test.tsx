import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../../src/components/header/header";
import "@testing-library/jest-dom/vitest";

// XXX very basic test to test the testing
describe("Header", () => {
    it("renders correctly", () => {
        render(<Header />);

        const paragraph = screen.getByRole("paragraph");

        expect(paragraph).toBeInTheDocument();
        expect(paragraph).toHaveTextContent(/Entain Practical Task/i);
    });
});
