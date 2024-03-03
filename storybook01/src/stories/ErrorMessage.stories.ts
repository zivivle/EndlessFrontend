import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "../components";

const meta = {
    // 경로에 대한 정보를 나타냄
    title: "Text/ErrorMessage",
    component: ErrorMessage,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text", description: "ErrorMessage 내용" },
    },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "에러 메세지는 여기로",
    },
};
