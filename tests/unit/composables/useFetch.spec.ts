import { useFetch } from '@/composables/useFetch';
import api from '@/services/api';
import { ref, nextTick } from 'vue';

jest.mock('@/services/api', () => ({
  get: jest.fn(),
}));

describe('useFetch', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockClear();
  });

  it('should set loading to true on reload', async () => {
    const mockData = { message: 'Initial data' };
    (api.get as jest.Mock).mockResolvedValue(Promise.resolve({ data: mockData }));

    const { loading, reload } = useFetch('/test-url');

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(loading.value).toBe(false);

    reload();
    expect(loading.value).toBe(true);

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(loading.value).toBe(false);
  });

  it('should fetch data successfully and update state', async () => {
    const mockData = { message: 'Data fetched!' };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const { data, loading, error } = useFetch('/test-url');

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(loading.value).toBe(false);
    expect(data.value).toEqual(mockData);
    expect(error.value).toBe('');
    expect(api.get).toHaveBeenCalledWith('/test-url');
  });

  it('should handle fetch error and update error state', async () => {
    const mockError = new Error('Failed to fetch data');
    (api.get as jest.Mock).mockRejectedValue(mockError);

    const { data, loading, error } = useFetch('/test-url');

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(loading.value).toBe(false);
    expect(data.value).toBeNull();
    expect(error.value).toBe('Failed to fetch data');
    expect(api.get).toHaveBeenCalledWith('/test-url');
  });
});