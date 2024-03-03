import type { Meta, StoryObj } from "@storybook/react";
import { DefaultTextField } from "../components";

const meta = {
    // 경로에 대한 정보를 나타냄
    title: "TextFields/DefaultTextField",
    component: DefaultTextField,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        iconAlt: {
            control: "text",
            description: "아이콘 이미지의 alt 속성",
            defaultValue: "icon",
        },
        iconPath: {
            control: "text",
            description: "아이콘 이미지의 경로",
            defaultValue: "",
        },
        onIconClick: {
            action: "onIconClick",
            description: "아이콘을 클릭했을 때 호출되는 함수",
        },
        errorMessage: {
            control: "text",
            description: "텍스트 필드의 에러 메시지",
            defaultValue: "",
        },
        placeholder: {
            control: "text",
            description: "텍스트 필드의 placeholder",
            defaultValue: "텍스트를 입력해주세요.",
        },
        value: {
            control: "text",
            description: "텍스트 필드의 값",
            defaultValue: "",
        },
        onChange: {
            action: "onChange",
            description: "텍스트 필드의 값이 변경되었을 때 호출되는 함수",
        },
        isError: {
            control: "boolean",
            description: "텍스트 필드의 에러 메시지를 표시할지 여부",
            defaultValue: false,
        },
        id: {
            control: "text",
            description: "텍스트 필드의 id",
            defaultValue: "",
        },
    },
} satisfies Meta<typeof DefaultTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        iconAlt: "icon",
        iconPath: "/images/delete_icon.svg",
        placeholder: "텍스트를 입력해주세요.",
        value: "",
        errorMessage: "텍스트를 확인해주세요",
        isError: false,
        id: "email",
    },
};
