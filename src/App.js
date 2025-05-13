import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
console.log("?? Latest Build Checking");

export default function App() {
    console.log("This is latest building new");
    
    const [sprites, setSprites] = useState([
        {
            id: 1,
            position: { x: 100, y: 100, rotation: 0 },
            speech: { visible: false, message: "" },
        },
    ]);

    const addSprite = () => {
        setSprites(prev => [
            ...prev,
            {
                id: Date.now(),
                blocks: [],
                position: { x: 0, y: 0, rotation: 0 },
                speech: { message: "", visible: false }
            }
        ]);
    };
    const updateSpriteBlocks = (spriteId, updater) => {
        setSprites(prev =>
            prev.map(sprite => {
                if (sprite.id !== spriteId) return sprite;

                const currentBlocks = Array.isArray(sprite.blocks) ? sprite.blocks : [];
                const newBlocks = typeof updater === "function" ? updater(currentBlocks) : updater;

                return { ...sprite, blocks: newBlocks };
            })
        );
    };
    const setSpritePosition = (id, position) => {
        setSprites((prev) =>
            prev.map((sprite) =>
                sprite.id === id ? { ...sprite, position: { ...sprite.position, ...position } } : sprite
            )
        );
    };
    const updateSpritePosition = (id, newPos) => {
        setSprites((prev) =>
            prev.map((sprite) =>
                sprite.id === id
                    ? {
                        ...sprite,
                        position: {
                            ...sprite.position,
                            x: newPos.x,
                            y: newPos.y,
                        },
                    }
                    : sprite
            )
        );
    };

    const executeBlocks = (blocks, sprite, indexOffset = 0) => {
        if (!Array.isArray(blocks)) {
            console.error("Expected 'blocks' to be an array but got:", blocks);
            return 0;
        }
        let newX = sprite.position.x;
        let newY = sprite.position.y;
        let newRotation = sprite.position.rotation;
        let delay = 0;

        blocks.forEach((block, i) => {
            if (block.type === "move") {
                newX += block.value;
            } else if (block.type === "turn") {
                newRotation += block.value;
            } else if (block.type === "goto") {
                newX = block.value.x;
                newY = block.value.y;
            } else if (block.type === "say" || block.type === "think") {
                const msg =
                    block.type === "think"
                        ? (block.value.message || "") + " ..."
                        : block.value.message || "Hello";
                const duration = (block.value.duration || 2) * 1000;

                setTimeout(() => {
                    setSprites(prev =>
                        prev.map(s =>
                            s.id === sprite.id
                                ? { ...s, speech: { message: msg, visible: true } }
                                : s
                        )
                    );
                    setTimeout(() => {
                        setSprites(prev =>
                            prev.map(s =>
                                s.id === sprite.id
                                    ? { ...s, speech: { message: "", visible: false } }
                                    : s
                            )
                        );
                    }, duration);
                }, delay);
                delay += 100;
            } else if (block.type === "repeat") {
                for (let r = 0; r < block.value.times; r++) {
                    delay += executeBlocks(block.value.blocks, sprite, delay);
                }
            }
        });

        // Set position after delay
        setTimeout(() => {
            setSprites(prev =>
                prev.map(s =>
                    s.id === sprite.id
                        ? {
                            ...s,
                            position: {
                                x: newX,
                                y: newY,
                                rotation: newRotation % 360
                            }
                        }
                        : s
                )
            );
        }, delay);

        return delay + 100; // return accumulated delay
    };



    const checkCollision = (spriteA, spriteB) => {
        const size = 100; // assume 100x100 size per sprite
        return (
            Math.abs(spriteA.position.x - spriteB.position.x) < size &&
            Math.abs(spriteA.position.y - spriteB.position.y) < size
        );
    };

    const runBlocks = async () => {
        for (const sprite of sprites) {
            await executeBlocks(sprite.blocks, sprite);
        }

        // Check for collision afterward (or during, if needed)
        const newSprites = [...sprites];
        let updated = false;

        for (let i = 0; i < newSprites.length; i++) {
            for (let j = i + 1; j < newSprites.length; j++) {
                const s1 = newSprites[i];
                const s2 = newSprites[j];

                if (checkCollision(s1, s2)) {
                    // Swap blocks
                    const tempBlocks = s1.blocks;
                    newSprites[i] = { ...s1, blocks: s2.blocks };
                    newSprites[j] = { ...s2, blocks: tempBlocks };
                    updated = true;
                }
            }
        }

        if (updated) setSprites(newSprites);
    };

   
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-col overflow-auto">
                    <button
                        onClick={addSprite}
                        className="m-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                         Add Sprite
                    </button>
                    <button
                        onClick={runBlocks}
                        className="m-2 px-4 py-2 bg-green-600 text-white rounded"
                    >
                         Play
                    </button>

                    <div className="flex">
                        {sprites.map((sprite) => (
                            <MidArea
                                key={sprite.id}
                                blocks={sprite.blocks}
                                updateBlocks={(newBlocks) =>
                                    updateSpriteBlocks(sprite.id, newBlocks)
                                }
                                runBlocks={runBlocks}
                            />

                        ))}
                    </div>
                </div>
                <PreviewArea sprites={sprites} setSpritePosition={setSpritePosition} />

            </div>
        </DndProvider>
    );
}
