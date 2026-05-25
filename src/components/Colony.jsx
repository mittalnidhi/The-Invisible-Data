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
            <div id="timeout-warning">Are you still there? Hover over the screen to continue, or return home in 10 seconds.</div>
            <ColonyNavBar />
            <div className='relative flex flex-row justify-between w-[94vw] h-full min-h-150 mt-6 2xl:mt-12 mx-auto text-white'>
                <div className='relative flex flex-col h-[100%] w-[34%] min-w-[300px]'>
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
                <div className='relative w-3/10 h-full'>
                    <ColonySilhouette {...silhouetteProps}/>
                </div>
                <div className='relative flex flex-col h-[100%] w-[34%] min-w-[300px]'>
                    <div className='relative h-full'>
                        <div className='gray-panel-content relative flex flex-col h-full gap-6 z-20'>
                            <div className='flex flex-row gap-4 items-baseline'>
                                <h5 className='filter-header-main'>Hormones</h5>
                                <Ornament />
                            </div>
                            <div className='relative w-full h-1/3 mx-auto'>
                                <HormoneGraph {...hormoneProps}/>
                            </div>                           
                            <ColonySelectorDivided {...hormoneProps}/>
                            <div className='flex flex-row mt-6 gap-4 items-baseline'>
                                <h5 className='filter-header-main'>Age</h5>
                                <Ornament />
                            </div>  
                            <div className='relative w-full h-1/3 mx-auto'>
                                <AgeGraph />
                            </div>   
                        </div>
                        <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />
                    </div>
                    <div className='flex-1 m-5 mt-4 2xl:mt-10'>
                        <button className='clear-filter' onClick={clearFilters}>Clear Filters</button>
                    </div>
                </div>
            </div>
            <div className='h-10'></div>
        </div>
    )
}

function ColonyNavBar() {
  return (
    <div className="colony-navbar">
      <a href="/" className="colony-brand">
        INVISIBLE DATA
      </a>

      <div className="colony-subnav">
        <NavLink
          to="/colony"
          className={({ isActive }) =>
            isActive ? "colony-subnav-link active" : "colony-subnav-link"
          }
        >
          Symptom Atlas
        </NavLink>

        <NavLink
          to="/cluster"
          className={({ isActive }) =>
            isActive ? "colony-subnav-link active" : "colony-subnav-link"
          }
        >
          Symptom Cluster
        </NavLink>

        <NavLink
          to="/experiences"
          className={({ isActive }) =>
            isActive ? "colony-subnav-link active" : "colony-subnav-link"
          }
        >
          Slice of Life
        </NavLink>
      </div>

      <div className="colony-nav-links">
        <NavLink to="/about">ABOUT</NavLink>

        <NavLink
          to="/path"
          className={({ isActive }) =>
            isActive ? "colony-path-link active" : "colony-path-link"
          }
        >
          PATH
        </NavLink>

        <NavLink to="/dear-peri">DEAR PERI</NavLink>
      </div>
    </div>
  );
}
