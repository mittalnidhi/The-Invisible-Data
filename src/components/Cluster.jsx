import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';
import ClusterChart from './ClusterChart';
import ClusterSilhouette from './ClusterSilhouette';
import ClusterSymptoms from './ClusterSymptoms';
import { NavLink } from "react-router-dom";


export default function Cluster(props){
    const [currentSymptom, setCurrentSymptom] = useState('');
    const [currentNeighbors, setCurrentNeighbors] = useState([]);

    function clearFilters(){
        setCurrentSymptom('');
    }

    const chartProps = {
        currentSymptom: currentSymptom,
        setCurrentSymptom: setCurrentSymptom,
        currentNeighbors: currentNeighbors,
        setCurrentNeighbors: setCurrentNeighbors
    }

    return (
        <div className='relative colony-main flex flex-col min-h-screen w-full z-30'>
            <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
            <ClusterNavBar />
            <div className='flex flex-row gap-6 lg:gap-10 2xl:gap-18 justify-between w-[90vw] h-[90vh] min-h-150 mt-6 2xl:mt-12 mx-auto text-white'>
                <div className='relative flex-1 flex flex-col h-4/5 min-w-[300px]'>
                    <div className='relative flex flex-col h-full max-h-[75vh] gap-4 z-20 box-sizing py-12'>
                        <h5 className='filter-header ml-3 mb-4 2xl:mb-7'>Select a Symptom</h5>
                        <ClusterSymptoms {...chartProps}/>                    
                    </div>
                    <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />           
                </div>
                <div className='flex-2 h-7/10 mt-12'>
                    <div className='bg-white rounded-4xl h-full'>
                        <ClusterChart {...chartProps}/>
                    </div>
                    <div className='mt-6 cluster-caption'>
                        Perimenopause symptoms often occur in clusters rather than in isolation. This visualization reveals common patterns in how they are experienced together. 
                    </div>             
                </div>
                <div className='flex-1 flex flex-col h-full min-w-[300px]'>
                    <div className='relative h-4/5'>
                        <div className='gray-panel-content relative h-full z-20'>
                            <ClusterSilhouette {...chartProps} />
                        </div>
                        <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />
                    </div>
                    <div className='flex-1 mx-5 mt-4 2xl:mt-10'>
                        <button className='clear-filter' onClick={clearFilters}>Reset Filters</button>
                    </div>
                    <div className='flex-1 hover-instruction'>
                        {'>>'} Hover over the dots to learn more
                    </div>
                </div>
            </div>
        </div>
    )
}

function ClusterNavBar() {
  return (
    <div className="colony-navbar">
      <a href="/" className="colony-brand">
        Invisible Data
      </a>

      <div className="colony-subnav">
        <NavLink to="/colony" className="colony-subnav-link">
          Symptom Atlas
        </NavLink>

        <NavLink to="/cluster" className="colony-subnav-link active">
          Symptom Cluster
        </NavLink>

        <NavLink to="/experiences" className="colony-subnav-link">
          Lived Experiences
        </NavLink>
      </div>

      <div className="colony-nav-links">
        <NavLink to="/about">ABOUT</NavLink>

        <NavLink to="/path" className="colony-path-link">
          PATH
        </NavLink>

        <NavLink to="/dear-peri">DEAR PERI</NavLink>
      </div>
    </div>
  );
}
