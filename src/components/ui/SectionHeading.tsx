'use client';

import { ScrollReveal } from './ScrollReveal';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <ScrollReveal className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-6 mx-auto w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
    </ScrollReveal>
  );
}
