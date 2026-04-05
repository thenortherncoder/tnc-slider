import {
	store as blockEditorStore,
	ButtonBlockAppender,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useRefEffect } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { select, subscribe } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SwiperInit } from './swiper-init';

import {
	ALLOWED_BLOCKS,
	DEFAULT_BLOCK,
	DEFAULT_BLOCK_ATTRIBUTES,
	DEFAULT_IMAGE,
	DEFAULT_IMAGE_ATTRIBUTES,
	DEFAULT_PARAGRAPH,
	DEFAULT_PARAGRAPH_ATTRIBUTES,
	PLACEHOLDER_IMG_1,
	PLACEHOLDER_IMG_2,
	PLACEHOLDER_IMG_3,
} from './constants';

export const Slider = memo( ( { attributes, clientId } ) => {
	const sliderRef = useRefEffect( ( element ) => {
		console.log('Element mounted');

		const options = {
			...attributes,
			...{
				autoplay: false,
				grabCursor: false,
				simulateTouch: false,
			},
		};

		let slider = SwiperInit( element, options );

		// get blocks inside main block and store the order in a ref so we can compare it when blocks are added/removed/moved.
		let slideOrder = select( blockEditorStore ).getBlockOrder( clientId );

		// Listen for changes in the block editor and update the slider if the order of the blocks has changed.
		const unsubscribeSliderUpdateListener = subscribe( () => {

			const currentSlidesOrder = select( blockEditorStore ).getBlockOrder( clientId );

			// Check if the slider has been changed.
			if ( currentSlidesOrder.toString() !== slideOrder.toString() ) {
				const selectedBlock = select( blockEditorStore ).getSelectedBlock();
				const slideAdded = currentSlidesOrder.length > slideOrder.length;
				const slideRemoved = currentSlidesOrder.length < slideOrder.length;
				const slideMoved = currentSlidesOrder.length === slideOrder.length;
				const activeIndex = slider.activeIndex;

				// Store the current slide order before destroying the slider instance.
				slideOrder = currentSlidesOrder;
				slider.destroy();

				window.requestAnimationFrame( () => {
					// Initialize slider.
					slider = SwiperInit( element, options );

					// Determine where the slider should go.
					let slideToIndex = activeIndex;
					if ( slideAdded ) {
						slideToIndex = slideOrder.length;
					} else if ( slideRemoved ) {
						slideToIndex = activeIndex - 1;
					} else if ( slideMoved ) {
						slideToIndex = slideOrder.findIndex(
							( clientId ) => clientId === selectedBlock.clientId // eslint-disable-line no-shadow
						);
					}

					if ( slideToIndex < 0 ) {
						slideToIndex = 0;
					}

					slider.slideTo( slideToIndex, 0 );
				} );
			}
		} );

		return () => {
			console.log('Element unmounted');
			unsubscribeSliderUpdateListener();
			slider.destroy();
		};
	} );

	const slideTemplate = [
		[
			DEFAULT_BLOCK,
			{
				...DEFAULT_BLOCK_ATTRIBUTES,
			},
			[
				[
					DEFAULT_IMAGE,
					{
						url: `${ PLACEHOLDER_IMG_1 }`,
						...DEFAULT_IMAGE_ATTRIBUTES,
					}
				],
				[
					DEFAULT_PARAGRAPH,
					{
						placeholder: __( 'Slide title…', 'tnc' ),
						...DEFAULT_PARAGRAPH_ATTRIBUTES,
					}
				],
			],
		],
	]

	// Our nested innerblocks that will be inserted by default.
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'swiper-wrapper' },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			defaultBlock: {
				name: DEFAULT_BLOCK,
				attributes: {
					url: `${ PLACEHOLDER_IMG_2 }`,
					...DEFAULT_BLOCK_ATTRIBUTES,
				},
			},
			directInsert: true,
			orientation: 'horizontal',
			template: slideTemplate,
			renderAppender: false,
			templateInsertUpdatesSelection: true,
		}
	);

	const { insertBlocks } = useDispatch( blockEditorStore );

	const addSlide = () => {
        const blocks = createBlocksFromInnerBlocksTemplate( slideTemplate );
        insertBlocks( blocks, undefined, clientId );
    };

	return (
		<>
			<div className="swiper" ref={ sliderRef }>
				<div { ...innerBlocksProps } />
			</div>

			{/* <ButtonBlockAppender
				className="slider-appender has-icon"
				rootClientId={ clientId }
			/> */}

			<Button
                className="slider-appender has-icon"
                onClick={ addSlide }
            >
                { __( 'Add slide', 'tnc' ) }
            </Button>
		</>
	);
} );
