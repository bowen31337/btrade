// Manual mock for lightweight-charts
const mockSeries = {
  setData: jest.fn(),
  update: jest.fn()
};

const mockVolumeSeriesMethods = {
  setData: jest.fn()
};

const mockCandlestickSeriesMethods = {
  setData: jest.fn(),
  update: jest.fn(),
};

// Create a persistent timeScale mock so fitContent can be properly tracked
const mockTimeScale = {
  fitContent: jest.fn()
};

const mockChart = {
  addCandlestickSeries: jest.fn(() => mockSeries),
  addHistogramSeries: jest.fn(() => mockVolumeSeriesMethods),
  addSeries: jest.fn((seriesType) => {
    if (seriesType === HistogramSeries) {
      return mockVolumeSeriesMethods;
    }
    return mockCandlestickSeriesMethods;
  }),
  timeScale: jest.fn(() => mockTimeScale),
  resize: jest.fn(),
  remove: jest.fn(),
  applyOptions: jest.fn()
};

export const createChart = jest.fn(() => mockChart);
export const CandlestickSeries = 'CandlestickSeries';
export const HistogramSeries = 'HistogramSeries';
export const ColorType = {
  Solid: 0,
  VerticalGradient: 1
};

export default {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType
};