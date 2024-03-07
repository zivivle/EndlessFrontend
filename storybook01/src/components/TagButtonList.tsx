import { useState } from "react";
import { TagButton } from "./TagButton";

interface ITagButtonList<T extends string> {
    tagList: T[];
    onTagClick: (tag: T) => void;
}

export const TagButtonList = <T extends string>({ tagList, onTagClick }: ITagButtonList<T>) => {
    const [selectedTag, setSelectedTag] = useState<T>(tagList[0]);

    /**
     * 현재 onTagClick은 클릭태 태그를 알 수 없다.
     * 하지만 이벤트버블링을 사용해서 전달해줄 수 있다!!
     *
     * -> 여기 onClick -> onTagClick에서 제네릭타입 적용해보기
     *
     */
    return (
        <div
            className="flex gap-4"
            onClick={(event) => {
                const eventTarget = event.target as HTMLButtonElement;
                const tag = eventTarget.textContent as T;
                onTagClick(tag);
            }}
        >
            {tagList.map((tag) => (
                <TagButton
                    key={tag}
                    isChecked={tag === selectedTag}
                    onClick={() => setSelectedTag(tag)}
                >
                    {tag}
                </TagButton>
            ))}
        </div>
    );
};
