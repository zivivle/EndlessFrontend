import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../components";

const meta = {
  // 경로에 대한 정보를 나타냄
  title: "Text/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    htmlFor: { control: "text", description: "label의 for 속성" },
    children: { control: "text", description: "label의 내용" },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    htmlFor: "username",
    children: "사용자 이름",
  },
};
