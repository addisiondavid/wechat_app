<template name="ec-canvas">
	<view class="ec-canvas-box">
		<canvas class="ec-canvas" :canvas-id="canvasId"
		@touchstart="ec.disableTouch ? '' : touchStart($event)" @touchmove="ec.disableTouch ? '' : touchMove($event)" @touchend="ec.disableTouch ? '' : touchEnd($event)">
		</canvas>
	</view>
</template>

<script>
	import WxCanvas from './wx-canvas/wx-canvas.js';
	import * as echarts from '../plugins/echarts/echarts.js';
	
	let ctx;
	export default {
		name: 'ec-canvas',
		// 此处定义传入的数据
		props: {
			canvasId: {
			    type: String,
			    value: 'ec-canvas'
			},
			ec: {
			    type: Object,
				value: {}
			}
		},
		data() {
			return {};
		},
		mounted() {
			if (!this.ec) {
				console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" '
					+ 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
				return;
			}
			if (!this.ec.lazyLoad) {
			    this.init();
			}
		},
		methods: {
			init(callback) {
			    ctx = uni.createCanvasContext(this.canvasId, this);
				
				const canvas = new WxCanvas(ctx, this.canvasId);
		
				echarts.setCanvasCreator(() => {
					return canvas;
				});
				
				if (typeof callback === 'function') {
					this.chart = callback(canvas);
				} else if (this.ec && typeof this.ec.onInit === 'function') {
					this.chart = this.ec.onInit(canvas);
				} else {
					this.triggerEvent('init', {
						canvas: canvas
					});
				}
			},
			
			canvasToTempFilePath(opt) {
				if (!opt.canvasId) {
					opt.canvasId = this.data.canvasId;
				}
		
				ctx.draw(true, () => {
					uni.canvasToTempFilePath(opt, this);
				});
			},
			
			touchStart(e) {
				if (this.chart && e.touches.length > 0) {
					const touch = e.touches[0];
					this.chart._zr.handler.dispatch('mousedown', {
						zrX: touch.x,
						zrY: touch.y
					});
					this.chart._zr.handler.dispatch('mousemove', {
						zrX: touch.x,
						zrY: touch.y
					});
				}
			},
			
			touchMove(e) {
				if (this.chart && e.touches.length > 0) {
					const touch = e.touches[0];
					this.chart._zr.handler.dispatch('mousemove', {
						zrX: touch.x,
						zrY: touch.y
					});
				}
			},
			
			touchEnd(e) {
				if (this.chart) {
					const touch = e.changedTouches ? e.changedTouches[0] : {};
					this.chart._zr.handler.dispatch('mouseup', {
						zrX: touch.x,
						zrY: touch.y
					});
					this.chart._zr.handler.dispatch('click', {
						zrX: touch.x,
						zrY: touch.y
					});
				}
			}
		}
	}
</script>

<style>
	.ec-canvas-box,
	.ec-canvas {
		width: 100%;
		height: 100%;
	}
</style>
