
import { useEffect, useRef } from 'react';
import * as d3 from "d3";
import colorMap from '../data/colorMap.json';

export default function ColonySymptoms(props) {
    let maxCount = 0;

    for (const entry of props.peridata) {
        maxCount = Math.max(maxCount, entry.value);
    }

    return (
        <div className="colony-symptoms-list flex flex-col p-1 h-full">
            {props.peridata.map((category, index) => {
                const chartRowsProps = {
                    index,
                    text: category.name,
                    width: maxCount > 0
                        ? category.value / maxCount
                        : 0,
                    currentCategory: props.currentCategory,
                    setCurrentCategory: props.setCurrentCategory,
                    peridata: props.peridata
                };

                return (
                    <ChartRow
                        key={category.name}
                        {...chartRowsProps}
                    />
                );
            })}
        </div>
    );
}

function ChartRow(props) {
    const barRef = useRef(null);

    useEffect(() => {
        if (!barRef.current) return;

        d3.select(barRef.current)
            .style('background-color', function () {
                if (props.currentCategory === '') {
                    return colorMap[props.text];
                }

                return props.currentCategory === props.text
                    ? colorMap[props.text]
                    : 'white';
            });
    }, [props.currentCategory, props.text]);

    function selectCategory(option) {
        props.setCurrentCategory(
            prev => option === prev ? '' : option
        );
    }

    return (
        <div
            onClick={() => selectCategory(props.text)}
            className="colony-symptom-row relative h-1/8 flex flex-row items-center gap-6"
            role="button"
            tabIndex={0}
            aria-pressed={props.currentCategory === props.text}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectCategory(props.text);
                }
            }}
        >
            <div className="colony-symptom-label chart-text flex-2 text-white text-right">
                {props.text}
            </div>

            <div className="colony-symptom-bar-track flex-3 h-[60%]">
                <div
                    ref={barRef}
                    className="chart-bar rounded-xs h-full text-[#00000000]"
                    style={{
                        width: `${props.width * 100}%`,
                        backgroundColor: colorMap[props.text]
                    }}
                >
                    A
                </div>
            </div>
        </div>
    );
}
