import * as d3 from 'd3';

export function showTooltip(event, text, element, align='left'){
	const box = d3.select(element)
		.html(text)
	const boxProps = box.node().getBoundingClientRect();
	box
		.style('left', align === 'left' ? `${event.clientX + 20}px` : `${event.clientX - boxProps.width / 2}px`)
		.style('top', `${event.clientY + 20}px`)
		.transition()
		.duration(150)
		.style('opacity', 1)
}

export function moveTooltip(event, element, align='left'){
	const box = d3.select(element)
	const boxProps = box.node().getBoundingClientRect();
	box
		.style('left', align === 'left' ? `${event.clientX + 20}px` : `${event.clientX - boxProps.width / 2}px`)
		.style('top', `${event.clientY + 20}px`)
}

export function hideTooltip(element){
	d3.select(element)
		.transition()
		.duration(150)
		.style('opacity', 0)
}
