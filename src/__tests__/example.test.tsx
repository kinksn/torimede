// jest.setup.tsで@testing-library/jest-domをインポートしているのでここでは不要
import { render, screen } from "@testing-library/react";
import React from "react";

// シンプルなコンポーネント
const ExampleComponent = () => (
  <div>
    <h1>Hello, Jest!</h1>
  </div>
);

it("renders a heading", () => {
  render(<ExampleComponent />);

  // headingが正しくレンダリングされることを確認
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent("Hello, Jest!");
});
