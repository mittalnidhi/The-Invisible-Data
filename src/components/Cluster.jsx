import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';
import ClusterChart from './ClusterChart';
import ClusterSilhouette from './ClusterSilhouette';
import ClusterSymptoms from './ClusterSymptoms';


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
        <div className='relative colony-main flex flex-col h-[100vh] w-full z-30'>
            <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
            <ClusterNavBar />
            <div className='flex flex-row gap-18 justify-between w-[90vw] h-[90vh] min-h-190 mt-4 mx-auto text-white'>
                <div className='relative flex-1 flex flex-col h-fit min-w-[300px]'>
                    <div className='relative flex flex-col h-full max-h-[75vh] gap-4 z-20 box-sizing py-15'>
                        <h5 className='filter-header ml-3 mb-7'>Select a Symptom</h5>
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
                    <div className='flex-1 m-5 mt-10'>
                        <button className='clear-filter' onClick={clearFilters}>Reset Filters</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ClusterNavBar(){
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

    const paragraph = "<p><b>Symptoms Travel in Patterns, Not in Isolation</b></p><br />\
        <p>Perimenopause symptoms rarely occur as single, independent experiences. Instead, they often appear together in recurring patterns known as symptom clusters. These clusters reflect the interconnected nature of hormonal fluctuations and how they influence multiple systems in the body at the same time. Rather than viewing symptoms as isolated events, this visualization highlights how they co-occur and interact, revealing broader patterns within the dataset.</p>\
        <p>Each circle represents an individual symptom, and colors indicate the category to which that symptom belongs, such as psychological, cognitive, vasomotor, metabolic, or physical symptoms. When symptoms appear together frequently in the dataset, they form clusters, helping illustrate common experiences reported by women navigating this stage.</p>\
        <p>The female body on the right provides a spatial overview of where these symptoms manifest and how different clusters relate across the body. This helps contextualize the symptoms physiologically while maintaining a holistic perspective of the experience.</p>\
        <p>On the left, a waffle chart shows the proportion of each cluster, indicating how prevalent or strongly represented a particular pattern is within the dataset. This provides a quick visual understanding of the relative scale and distribution of symptom groupings.</p>\
        <p>This view presents all identified clusters at once, offering a high-level map of symptom relationships. Users can click on any symptom (circle) to explore additional details, understand related symptoms within that cluster, and learn more about how these patterns appear in the data.</p>"
    
    return (
        <div className='relative flex flex-row justify-between w-full h-50'>
            <div ref={tooltipRef} className='tooltip'></div>
            <div className='justify-self-start flex flex-row gap-5 z-50'>
                <h1 className='colony-title text-center ml-12 mt-10'>The Invisible Data</h1>
            </div>
            <div className='flex flex-row justify-center gap-5'>
                <a href={'/colony'}><div className='nav-bar-path-choice'>Symptom Atlas</div></a>
                <div className='nav-bar-path-choice current-page'>Symptom Cluster</div>
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
