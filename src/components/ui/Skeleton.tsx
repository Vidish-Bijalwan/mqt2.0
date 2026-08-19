'use client';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-5 h-5 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function PackageDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-64 md:h-96 bg-gray-200">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
