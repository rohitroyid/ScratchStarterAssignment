import React from "react";
import { useDrop } from "react-dnd";
import { FaTimes } from "react-icons/fa";

export default function MidArea({ blocks, updateBlocks, runBlocks }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "block",

        drop: (item) => {
            const newBlock = {
                id: Date.now(),
                type: item.type,
                value:
                    item.type === "move" || item.type === "turn"
                        ? 10
                        : item.type === "goto"
                            ? { x: 0, y: 0 }
                            : item.type === "say" || item.type === "think"
                                ? { message: "Hello", duration: 2 }
                                : item.type === "repeat"
                                    ? { times: 3, blocks: [] }
                                    : {}
            };

            updateBlocks(prev => [...prev, newBlock]); // ✅ this now works correctly
        },


        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const updateBlockValue = (blockId, newValue) => {
        updateBlocks(
            blocks.map((block) =>
                block.id === blockId ? { ...block, value: newValue } : block
            )
        );
    };

    const removeBlock = (blockId) => {
        updateBlocks(blocks.filter((block) => block.id !== blockId));
    };



    return (
        <div
            ref={drop}
            className="w-[400px] h-full overflow-auto p-4 bg-gray-100 border-r border-gray-200"
        >
            <h2 className="font-bold mb-2">Sprite Area</h2>

            {Array.isArray(blocks) && blocks.map((block) => (
                <div
                    key={block.id}
                    className={`p-2 my-2 flex flex-col bg-${block.type === "repeat" ? "purple" : "blue"}-300 text-white rounded`}
                >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        {block.type === "move" && (
                            <>
                                <span>Move</span>
                                <input
                                    type="number"
                                    value={block.value}
                                    onChange={(e) =>
                                        updateBlockValue(
                                            block.id,
                                            parseInt(e.target.value, 10) || 0
                                        )
                                    }
                                    className="mx-2 w-16 px-1 text-black rounded"
                                />
                                <span>steps</span>
                            </>
                        )}

                        {block.type === "turn" && (
                            <>
                                <span>Turn</span>
                                <input
                                    type="number"
                                    value={block.value}
                                    onChange={(e) =>
                                        updateBlockValue(
                                            block.id,
                                            parseInt(e.target.value, 10) || 0
                                        )
                                    }
                                    className="mx-2 w-16 px-1 text-black rounded"
                                />
                                <span>degrees</span>
                            </>
                        )}

                        {block.type === "goto" && (
                            <>
                                <span>Go to</span>
                                <input
                                    type="number"
                                    value={block.value.x}
                                    onChange={(e) =>
                                        updateBlockValue(block.id, {
                                            ...block.value,
                                            x: parseInt(e.target.value, 10) || 0,
                                        })
                                    }
                                    className="mx-2 w-16 px-1 text-black rounded"
                                />
                                <span>X</span>
                                <span className="mx-2">and</span>
                                <input
                                    type="number"
                                    value={block.value.y}
                                    onChange={(e) =>
                                        updateBlockValue(block.id, {
                                            ...block.value,
                                            y: parseInt(e.target.value, 10) || 0,
                                        })
                                    }
                                    className="mx-2 w-16 px-1 text-black rounded"
                                />
                                <span>Y</span>
                            </>
                        )}

                        {["say", "think"].includes(block.type) && (
                            <>
                                <span>{block.type === "say" ? "Say" : "Think"}</span>
                                <input
                                    type="text"
                                    value={block.value.message}
                                    onChange={(e) =>
                                        updateBlockValue(block.id, {
                                            ...block.value,
                                            message: e.target.value,
                                        })
                                    }
                                    className="mx-2 w-32 px-1 text-black rounded"
                                />
                                <span>for</span>
                                <input
                                    type="number"
                                    value={block.value.duration}
                                    onChange={(e) =>
                                        updateBlockValue(block.id, {
                                            ...block.value,
                                            duration: parseInt(e.target.value, 10) || 2,
                                        })
                                    }
                                    className="mx-2 w-16 px-1 text-black rounded"
                                />
                                <span>seconds</span>
                            </>
                        )}

                        {block.type === "repeat" && (
                            <>
                                <span>Repeat</span>
                                <input
                                    type="number"
                                    value={block.value.times}
                                    onChange={(e) =>
                                        updateBlockValue(block.id, {
                                            ...block.value,
                                            times: parseInt(e.target.value, 10) || 1,
                                        })
                                    }
                                    className="mx-2 w-16 px-1 text-black rounded"
                                />
                                <span>times</span>
                            </>
                        )}

                        <FaTimes
                            className="cursor-pointer text-red-500 ml-2"
                            onClick={() => removeBlock(block.id)}
                        />
                    </div>

                    {block.type === "repeat" && (
                        <div className="ml-4 mt-2">
                            <MidArea
                                blocks={block.value.blocks}
                                updateBlocks={(newInner) =>
                                    updateBlockValue(block.id, {
                                        ...block.value,
                                        blocks: newInner,
                                    })
                                }
                                runBlocks={() => { }}
                            />
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
}




