import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import peridata from '../data/peridata.json'
import ColonySymptoms from './ColonySymptoms';
import ColonySelectorDivided from './ColonySelectorDivided';
import ColonySelectorPill from './ColonySelectorPill';
import ColonySilhouette from './ColonySilhouette';
import { NavLink } from 'react-router-dom';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';
import AgeGraph from './AgeGraph';
import Ornament from './Ornament';
import HormoneGraph from './HormoneGraph';

const viewOptions = ['Intense', 'Less Frequent', 'High Frequency'];
const hormoneOptions = ['FSH', 'Testosterone', 'Estrogen', 'Progesterone'];

export default function Colony(props){
    const [currentCategory, setCurrentCategory] = useState('');
    const [currentView, setCurrentView] = useState('');
    const [currentStage, setCurrentStage] = useState('');
    const [currentHormone, setCurrentHormone] = useState('');

    function clearFilters(){
        setCurrentCategory('');
        setCurrentView('')
        setCurrentStage('');
        setCurrentHormone('');
    }

    const symptomsProps = {
        peridata: peridata.symptoms.children,
        currentCategory: currentCategory,
        setCurrentCategory: setCurrentCategory
    }

    const viewProps = {
        options: viewOptions,
        currentOption: currentView,
        setCurrentOption: setCurrentView     
    };

    const stageProps = {
        options: ['Early', 'Late'],
        currentOption: currentStage,
        setCurrentOption: setCurrentStage,
    }

    const hormoneProps = {
        options: hormoneOptions,
        currentOption: currentHormone,
        setCurrentOption: setCurrentHormone  
    };

    const silhouetteProps = {
        peridata: peridata.symptoms.children,
        currentCategory: currentCategory,
        currentView: currentView,
        currentStage: currentStage,
        currentHormone: currentHormone
    }

    return (
        <div className='relative colony-main flex flex-col h-[100vh] w-full z-30'>
            <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
            <ColonyNavBar />
            <div className='flex flex-row justify-between w-[90vw] h-full min-h-190 mt-12 mx-auto text-white'>
                <div className='relative flex flex-col h-fit w-3/10 min-w-[300px]'>
                    <div className='gray-panel-content flex flex-col h-full gap-4 z-20'>
                        <div className='flex flex-row gap-4 items-baseline'>
                            <h5 className='filter-header-main'>Select a Symptom</h5>
                            <Ornament />
                        </div>           
                        <ColonySymptoms {...symptomsProps}/>
                        <h5 className='filter-header mt-6'>View</h5>
                        <ColonySelectorDivided {...viewProps}/>
                        <div className='flex flex-row items-center mt-6'>
                            <h5 className='filter-header'>Stage</h5>
                            <div className='ml-15'>
                                <ColonySelectorPill {...stageProps}/>
                            </div>
                        </div> 
                    </div>
                    <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />           
                </div>
                <div className='w-1/3 aspect-[1241/1754]'>
                    <ColonySilhouette {...silhouetteProps}/>
                </div>
                <div className='relative flex flex-col h-9/10 w-3/10 min-w-[300px]'>
                    <div className='relative h-fit'>
                        <div className='gray-panel-content relative flex flex-col h-full gap-6 z-20'>
                            <div className='flex flex-row gap-4 items-baseline'>
                                <h5 className='filter-header-main'>Hormones</h5>
                                <Ornament />
                            </div>
                            <div className='relative w-full h-50 mx-auto'>
                                <HormoneGraph {...hormoneProps}/>
                            </div>                           
                            <ColonySelectorDivided {...hormoneProps}/>
                            <div className='flex flex-row mt-12 gap-4 items-baseline'>
                                <h5 className='filter-header-main'>Age</h5>
                                <Ornament />
                            </div>  
                            <div className='relative w-full h-50 mx-auto'>
                                <AgeGraph />
                            </div>   
                        </div>
                        <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />
                    </div>
                    <div className='flex-1 m-5 mt-10'>
                        <button className='clear-filter' onClick={clearFilters}>Clear Filters</button>
                    </div>
                </div>
            </div>
            <div className='h-10'></div>
        </div>
    )
}

function ColonyNavBar(){
    const leftArrowRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        d3.select(leftArrowRef.current).select('span')
            .style('transition', 'transform 150ms ease')
        d3.select(leftArrowRef.current)
            .on('mouseover', e => {
                d3.select(leftArrowRef.current).select('span')
                    .style('transform', 'translate(-5px, 0)')
            })
            .on('mouseout', e => {
                d3.select(leftArrowRef.current).select('span')
                    .style('transform', null)
            })
    }, [])

    const paragraph = 'This visualization maps the range of symptoms experienced during this stage. The panel on the right lists symptoms identified through analysis of 38,900 comments from online community discussions on Reddit, ordered by frequency. On the left, the panel shows how low/high hormones results to symptoms and age range observed in the dataset.'

    return (
        <div className='relative flex flex-row justify-between w-full h-50'>
            <div ref={tooltipRef} className='tooltip'></div>
            <div className='justify-self-start flex flex-row gap-5 z-50'>
                <h1 className='colony-title text-center ml-12 mt-10'>The Invisible Data</h1>
            </div>
            <div className='flex flex-row justify-center gap-5'>
                <div className='nav-bar-path-choice current-page'>Symptom Atlas</div>
                <a href={'/cluster'}><div className='nav-bar-path-choice'>Symptom Cluster</div></a>
                <a href={'/experiences'}><div className='nav-bar-path-choice'>Lived Experiences</div></a>
            </div>          
            <div className='justify-self-end flex flex-row justify-end-safe gap-12 mr-12 mt-10 z-50'>
                <a href={'/about'}>About</a>
                <a href={'/path'}>Path</a>
                <a href={'/dear-peri'}>Dear Peri</a>
            </div>               
        </div>       
    )
}
