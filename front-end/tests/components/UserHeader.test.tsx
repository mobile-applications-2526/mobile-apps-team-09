import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { UserHeader } from '@/components/home/UserHeader';

// Mock the getInitials utility
jest.mock('@/utils/plantHelpers', () => ({
  getInitials: (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  },
}));

describe('UserHeader', () => {
  describe('User Display', () => {
    it('should display full name when provided', () => {
      render(
        <UserHeader
          fullName="Margaret Williams"
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('Hi, Margaret Williams!')).toBeTruthy();
    });

    it('should display username when full name is null', () => {
      render(
        <UserHeader
          fullName={null}
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('Hi, margaret!')).toBeTruthy();
    });

    it('should display username when full name is empty string', () => {
      render(
        <UserHeader
          fullName=""
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('Hi, margaret!')).toBeTruthy();
    });
  });

  describe('Plant Count Display', () => {
    it('should display singular "plant" when count is 1', () => {
      render(
        <UserHeader
          fullName="Margaret Williams"
          username="margaret"
          plantCount={1}
        />
      );

      expect(screen.getByText('1 plant in your garden')).toBeTruthy();
    });

    it('should display plural "plants" when count is 0', () => {
      render(
        <UserHeader
          fullName="Margaret Williams"
          username="margaret"
          plantCount={0}
        />
      );

      expect(screen.getByText('0 plants in your garden')).toBeTruthy();
    });

    it('should display plural "plants" when count is greater than 1', () => {
      render(
        <UserHeader
          fullName="Margaret Williams"
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('5 plants in your garden')).toBeTruthy();
    });

    it('should display plural "plants" for large numbers', () => {
      render(
        <UserHeader
          fullName="Margaret Williams"
          username="margaret"
          plantCount={100}
        />
      );

      expect(screen.getByText('100 plants in your garden')).toBeTruthy();
    });
  });

  describe('Profile Initials', () => {
    it('should display initials from full name', () => {
      render(
        <UserHeader
          fullName="Margaret Williams"
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('MW')).toBeTruthy();
    });

    it('should display initials from username when full name is null', () => {
      render(
        <UserHeader
          fullName={null}
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('M')).toBeTruthy();
    });

    it('should handle single name correctly', () => {
      render(
        <UserHeader
          fullName="Margaret"
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('M')).toBeTruthy();
    });

    it('should handle multiple names and show first two initials', () => {
      render(
        <UserHeader
          fullName="Margaret Anne Williams"
          username="margaret"
          plantCount={5}
        />
      );

      expect(screen.getByText('MA')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should render all elements together correctly', () => {
      render(
        <UserHeader
          fullName="John Doe"
          username="johnd"
          plantCount={3}
        />
      );

      expect(screen.getByText('JD')).toBeTruthy();
      expect(screen.getByText('Hi, John Doe!')).toBeTruthy();
      expect(screen.getByText('3 plants in your garden')).toBeTruthy();
    });
  });
});
