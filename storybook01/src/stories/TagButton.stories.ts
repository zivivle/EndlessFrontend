import type { Meta, StoryObj } from "@storybook/react";
import { TagButton } from "../components";

const meta = {
    title: "Buttons/TagButton",
    component: TagButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text", description: "버튼의 tag 내용", defaultValue: "" },
        isChecked: {
            control: "boolean",
            description: "버튼이 체크되었는지 여부",
            defaultValue: false,
        },
        onClick: { action: "clicked", description: "버튼 클릭 이벤트" },
    },
} satisfies Meta<typeof TagButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "TagButton",
        isChecked: false,
    },
};
