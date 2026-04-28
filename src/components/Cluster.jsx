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
        <div className='relative colony-main flex flex-col h-full w-full z-30'>
            <ClusterNavBar />
            <div className='flex flex-row gap-20 justify-between w-[90vw] h-[75vh] min-h-190 my-8 mx-auto text-white'>
                <div className='relative flex-1 flex flex-col h-[55vh] min-w-[300px] mt-12'>
                    <div className='relative flex flex-col h-full gap-4 z-20 box-sizing py-15'>
                        <h5 className='filter-header ml-3'>Select a Symptom</h5>
                        <ClusterSymptoms {...chartProps}/>                    
                    </div>
                    <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />           
                </div>
                <div className='flex-2 h-full mt-12'>
                    <div className='w-[37vw] aspect-3/2 mx-auto bg-white rounded-2xl'>
                        <ClusterChart {...chartProps}/>
                    </div>                   
                </div>
                <div className='flex-1 flex flex-col h-full min-w-[300px]'>
                    <div className='relative h-4/5'>
                        <div className='gray-panel-content relative h-full z-20'>
                            <ClusterSilhouette {...chartProps} />
                        </div>
                        <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />
                    </div>
                    <div className='flex-1 m-5'>
                        <button className='clear-filter' onClick={clearFilters}>Reset Filters</button>
                    </div>
                </div>
            </div>
            <div className='h-45'></div>
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
        <div className='relative grid grid-cols-3 grid-rows-1 items-center w-full h-25'>
            <div ref={tooltipRef} className='tooltip'></div>
            <div className='justify-self-start flex flex-row gap-5 items-center justify-start z-50'>
                <a href={'/'} ref={leftArrowRef}><span className='relative inline-block'><img src='leftArrow.svg' className='inline h-6 ml-16 mr-3'/></span>Path</a>
                <span className='navbar-divider-left'></span>
                <a href={'/'}><img src='home.svg' style={{height: '20px'}} /></a>
                <img src='info.svg' style={{height: '20px'}} onMouseOver={(e) => showTooltip(e, paragraph, tooltipRef.current)} onMouseOut={(e) => hideTooltip(tooltipRef.current)}/>
            </div> 
            <div>
                <h1 className='colony-title text-center mt-8'>Symptom Cluster</h1>
            </div>          
            <div className='justify-self-end flex flex-row justify-end-safe gap-6 z-50'>
                <a href={'/colony'}>Colony of Symptoms</a>
                <span className='navbar-divider-right'></span>
                <a href={'/experiences'}>Experiences</a>
                <a href={'/'} className='mr-16'>Dear Peri</a>
            </div>               
        </div>       
    )
}