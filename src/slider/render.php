<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
$autoplay   = empty( $attributes['autoplay'] ) ? false : $attributes['autoplay'];
$navigation = empty( $attributes['navigation'] ) ? false : $attributes['navigation'];
$pagination = empty( $attributes['pagination'] ) ? false : $attributes['pagination'];
$slidesPerView = empty( $attributes['slidesPerView'] ) ? 3 : $attributes['slidesPerView'];

$swiper_attr = array(
	'autoplay'   => $autoplay,
	'navigation' => $navigation,
	'pagination' => $pagination,
	'slidesPerView' => $slidesPerView,
);

$swiper_attr = htmlspecialchars( wp_json_encode( $swiper_attr ) );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'swiper',
	)
);
?>

<div <?php echo wp_kses_data( $wrapper_attributes ) . 'data-swiper="' . esc_attr( $swiper_attr ) . '"'; ?>>
	<div class="swiper-wrapper">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>
