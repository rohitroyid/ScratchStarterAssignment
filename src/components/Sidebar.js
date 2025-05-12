import React from "react";
import { useDrag } from "react-dnd";
import Icon from "./Icon";

const DraggableBlock = ({ text, type }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "block",
        item: { type }, // we'll use this in the workspace
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        >
            {text}
        </div>
    );
};

export default function Sidebar() {
    return (
        <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
            <div className="font-bold"> {"Motion"} </div>
            <DraggableBlock text="Move _ steps" type="move" />
            <DraggableBlock text="Turn _ degrees" type="turn" />
            <DraggableBlock text="Go to X:_Y:_" type="goto" />
            <div className="font-bold"> {"Looks"} </div>
            <DraggableBlock text="Say _ for _ seconds" type="say" />
            <DraggableBlock text="Think _ for _ seconds" type="think" />

            {/* Add more draggable blocks here later */}
        </div>

    );
}





