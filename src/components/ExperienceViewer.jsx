import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ExperienceViewer(props) {
    const [currentStory, setCurrentStory] = useState(-1)
    const [dummy, setDummy] = useState(true);
    const storyRef = useRef(null);

    function handleClick(index){
        setCurrentStory(index)
    }

    function closeViewer(){
        setCurrentStory(-1);
        d3.select('#exp-viewer')
            .style('opacity', 0)
            .style('pointer-events', 'none');
        d3.select('canvas')
            .classed('canvas-blur', false);
        d3.select('body')
            .style('overflow', 'auto')
    }

    useEffect(() => {
        const storyNode = d3.select(storyRef.current);
        if(!props.currentLabel.stories || currentStory < 0){
            storyNode.text('Select a story...')
        } else {
            storyNode.text(props.currentLabel.stories[currentStory])
        }
    }, [currentStory])

    useEffect(() => {
        const container = d3.select('#story-container');
        container.selectAll('div')
            .data(props.currentLabel.stories)
            .join('div')
            .attr('class', 'story flex-none w-[200px] h-[140px] px-2 overflow-hidden')
            .on('click', (_, d) => handleClick(props.currentLabel.stories.indexOf(d)))
            .text(s => shortenText(s))
    }, [dummy, props.currentLabel.stories])

    function addStory(){
        const textArea = d3.select('#input-story').node();
        const text = textArea.value;
        if(text.trim().length > 0){
            props.setCurrentLabel((prev) => {
                prev.stories = [...prev.stories, text.trim()];
                if(prev.stories.at(-1) === prev.stories.at(-2)){
                    prev.stories.pop();
                }
                return prev;
            })
            setDummy((prev) => !prev);
            textArea.value = '';
        }
    }

    function shortenText(text){
        if(text.length <= 100) return text;
        let shortened = text.slice(0, 100);
        return `${shortened.slice(0, shortened.lastIndexOf(' '))}...`;
    }

    return (
        <div id='exp-viewer' className='fixed flex flex-col gap-6 p-8 rounded-[20px] w-7/10 h-7/10 top-3/20 left-3/20 z-10'>
            <p className='text-2xl'>{props.currentLabel.label}</p>           
            <div id='story-container' className='relative px-5 h-[180px] flex flex-row flex-nowrap gap-5 overflow-x-auto'></div>
            <div className='flex-3 flex flex-row gap-12'>
                <div ref={storyRef} id='story-focus' className='flex-2'>
                    Select a story...
                </div>
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='flex-4'>
                        <textarea type='text' id='input-story' placeholder='Write your story' className='w-full h-full'></textarea>
                    </div>
                    <button id='story-submit' className='flex-1' onClick={addStory}>Submit</button>
                </div>
            </div>           
            <div className='focus-x pointer-events-auto cursor-pointer' onClick={closeViewer}>×</div>
        </div>
    )
}
