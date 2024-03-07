import type { Meta, StoryObj } from "@storybook/react";
import { TagButtonList } from "../components";

const meta = {
    title: "List/TagButtonList",
    component: TagButtonList,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        tagList: {
            control: "array",
            description: "태그 목록",
            defaultValue: ["Tag1", "Tag2", "Tag3"],
        },
        onTagClick: { action: "clicked", description: "선택된 태그 버튼 업데이트" },
    },
} satisfies Meta<typeof TagButtonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        tagList: ["Tag1", "Tag2", "Tag3"],
    },
};
