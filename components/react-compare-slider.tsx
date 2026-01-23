import { ReactCompareSlider, ReactCompareSliderImage,ReactCompareSliderHandle } from 'react-compare-slider';

export default function ImageComparison() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
      <ReactCompareSlider
      // 自定义手柄 (Handle)
      handle={
        <ReactCompareSliderHandle
          buttonStyle={{
            width: '36px', 
            height: '36px',
            backdropFilter: 'none',
            // background: 'black', // 按钮背景色
            border: '2px solid white',
            // boxShadow: '0 0 5px rgba(0,0,0,0.5)',
            // display: 'none' // 取消注释此行可彻底隐藏圆形按钮
          }}
          linesStyle={{
            // 修改线条颜色为黑色
            color: 'white',
            width: '2px', // 甚至可以调整线条宽度
            opacity: 1,
          }}
        />
      }
        itemOne={
          <ReactCompareSliderImage 
            src="/before.jpg" 
            alt="原图" 
          />
        }
        itemTwo={
          <ReactCompareSliderImage 
            src="/after.jpg" 
            alt="处理后" 
          />
        }
        // 线条默认位置 (50%)
        position={50}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}