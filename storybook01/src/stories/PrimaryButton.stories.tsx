import type { Meta, StoryObj } from "@storybook/react";
import { PrimaryButton } from "../components";

const meta = {
    title: "Buttons/PrimaryButton",
    component: PrimaryButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <div style={{ width: "360px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        theme: {
            control: {
                type: "select",
                options: ["dark", "light", "social", "text"],
            },
            description: "버튼 테마",
            defaultValue: "dark",
        },
        children: {
            control: "text",
            description: "버튼의 title",
            defaultValue: "PrimaryButton",
        },
        onClick: {
            action: "clicked",
            description: "버튼 클릭시 실행될 함수",
        },
        disabled: {
            control: "boolean",
            description: "버튼을 비활성화할지 여부",
            defaultValue: true,
        },
    },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
    args: {
        theme: "dark",
        children: "Button",
        disabled: false,
    },
};

export const Light: Story = {
    args: {
        theme: "light",
        children: "Button",
        disabled: false,
    },
};

export const Social: Story = {
    args: {
        theme: "social",
        children: "Button",
        disabled: false,
    },
};

export const Text: Story = {
    args: {
        theme: "text",
        children: "Button",
        disabled: false,
    },
};

export const Disabled: Story = {
    args: {
        theme: "dark",
        children: "Button",
        disabled: true,
    },
};
