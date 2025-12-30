import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AttentionCards } from '@/components/home/AttentionCards';
import { Plant } from '@/utils/plantHelpers';
import { PlantNavigationProvider } from '@/contexts/PlantNavigationContext';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock IconSymbol component
jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name }: any) => null,
}));

// Wrapper component with provider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <PlantNavigationProvider>{children}</PlantNavigationProvider>;
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe('AttentionCards', () => {
  const mockPlants: Plant[] = [
    {
      id: 1,
      plant_name: 'Monstera',
      species: {
        id: 1,
        common_name: 'Swiss Cheese Plant',
        scientific_name: 'Monstera deliciosa',
        watering_frequency_days: 7,
        sunlight_requirement: 'Bright indirect',
        difficulty_level: 'Easy',
      },
      image_url: 'https://example.com/monstera.jpg',
      user_id: 1,
      species_id: 1,
      location: 'Living Room',
      date_acquired: '2024-01-01',
      notes: null,
      last_watered: null,
      next_water_date: '2024-01-08',
    },
    {
      id: 2,
      plant_name: 'Pothos',
      species: {
        id: 2,
        common_name: 'Devil\'s Ivy',
        scientific_name: 'Epipremnum aureum',
        watering_frequency_days: 5,
        sunlight_requirement: 'Low to bright indirect',
        difficulty_level: 'Easy',
      },
      image_url: null,
      user_id: 1,
      species_id: 2,
      location: 'Kitchen',
      date_acquired: '2024-01-15',
      notes: 'Needs pruning',
      last_watered: '2024-01-20',
      next_water_date: '2024-01-25',
    },
  ];

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('Empty State', () => {
    it('should render nothing when plants array is empty', () => {
      const { toJSON } = customRender(<AttentionCards plants={[]} />);
      expect(toJSON()).toBeNull();
    });

    it('should not display section header when no plants', () => {
      customRender(<AttentionCards plants={[]} />);
      expect(screen.queryByText('Needs Attention Today')).toBeNull();
    });
  });

  describe('Section Header', () => {
    it('should display section title when plants exist', () => {
      customRender(<AttentionCards plants={mockPlants} />);
      expect(screen.getByText('Needs Attention Today', { exact: false })).toBeTruthy();
    });

    it('should display correct plant count in badge', () => {
      customRender(<AttentionCards plants={mockPlants} />);
      expect(screen.getByText('2')).toBeTruthy();
    });

    it('should display count of 1 for single plant', () => {
      customRender(<AttentionCards plants={[mockPlants[0]]} />);
      expect(screen.getByText('1')).toBeTruthy();
    });

    it('should display large count correctly', () => {
      const manyPlants = Array(15).fill(mockPlants[0]).map((plant, index) => ({
        ...plant,
        id: index + 1,
      }));
      customRender(<AttentionCards plants={manyPlants} />);
      expect(screen.getByText('15')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to garden tab when chevron is pressed', () => {
      const { UNSAFE_getAllByType } = customRender(<AttentionCards plants={mockPlants} />);
      const { TouchableOpacity } = require('react-native');

      // Get all TouchableOpacity components
      const touchables = UNSAFE_getAllByType(TouchableOpacity);
      // The first touchable should be the header navigation button
      fireEvent.press(touchables[0]);

      expect(mockPush).toHaveBeenCalledWith('/(tabs)/garden');
    });

    it('should call router.push only once per press', () => {
      const { UNSAFE_getAllByType } = customRender(<AttentionCards plants={mockPlants} />);
      const { TouchableOpacity } = require('react-native');

      const touchables = UNSAFE_getAllByType(TouchableOpacity);
      fireEvent.press(touchables[0]);

      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe('Plant Cards Rendering', () => {
    it('should render all plants in the list', () => {
      customRender(<AttentionCards plants={mockPlants} />);

      expect(screen.getByText('Monstera')).toBeTruthy();
      expect(screen.getByText('Pothos')).toBeTruthy();
    });

    it('should display plant common names', () => {
      customRender(<AttentionCards plants={mockPlants} />);

      expect(screen.getByText('Swiss Cheese Plant')).toBeTruthy();
      expect(screen.getByText('Devil\'s Ivy')).toBeTruthy();
    });

    it('should display water badge for all plants', () => {
      customRender(<AttentionCards plants={mockPlants} />);

      const waterBadges = screen.getAllByText('Water');
      expect(waterBadges.length).toBe(2);
    });

    it('should handle single plant correctly', () => {
      customRender(<AttentionCards plants={[mockPlants[0]]} />);

      expect(screen.getByText('Monstera')).toBeTruthy();
      expect(screen.queryByText('Pothos')).toBeNull();
    });
  });

  describe('Image Handling', () => {
    it('should render image when image_url is provided', () => {
      const { UNSAFE_getAllByType } = customRender(<AttentionCards plants={[mockPlants[0]]} />);
      const { Image } = require('react-native');

      const images = UNSAFE_getAllByType(Image);
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render placeholder when image_url is null', () => {
      customRender(<AttentionCards plants={[mockPlants[1]]} />);

      // Placeholder view should be rendered (no image role for null image_url)
      expect(screen.getByText('Pothos')).toBeTruthy();
    });

    it('should handle mixed image scenarios', () => {
      customRender(<AttentionCards plants={mockPlants} />);

      // One plant has image, one doesn't
      expect(screen.getByText('Monstera')).toBeTruthy();
      expect(screen.getByText('Pothos')).toBeTruthy();
    });
  });

  describe('Plant Name Truncation', () => {
    it('should handle long plant names', () => {
      const longNamePlant: Plant = {
        ...mockPlants[0],
        plant_name: 'This is a very long plant name that should be truncated',
      };

      customRender(<AttentionCards plants={[longNamePlant]} />);
      expect(screen.getByText('This is a very long plant name that should be truncated')).toBeTruthy();
    });

    it('should handle long species names', () => {
      const longSpeciesPlant: Plant = {
        ...mockPlants[0],
        species: {
          ...mockPlants[0].species,
          common_name: 'This is a very long species common name that should truncate',
        },
      };

      customRender(<AttentionCards plants={[longSpeciesPlant]} />);
      expect(screen.getByText('This is a very long species common name that should truncate')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle plant with empty string name', () => {
      const emptyNamePlant: Plant = {
        ...mockPlants[0],
        plant_name: '',
      };

      customRender(<AttentionCards plants={[emptyNamePlant]} />);
      expect(screen.getByText('')).toBeTruthy();
    });

    it('should handle special characters in plant names', () => {
      const specialCharPlant: Plant = {
        ...mockPlants[0],
        plant_name: 'My Plant ☘️ & Co.',
      };

      customRender(<AttentionCards plants={[specialCharPlant]} />);
      expect(screen.getByText('My Plant ☘️ & Co.')).toBeTruthy();
    });
  });
});
