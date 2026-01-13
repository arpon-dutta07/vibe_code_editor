import React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'bg-card relative w-full max-w-sm rounded-2xl',
				'p-1.5 shadow-xl backdrop-blur-xl',
				'bg-linear-to-b from-white/90 via-gray-50/90 to-white/90 dark:from-zinc-900/90 dark:via-zinc-800/90 dark:to-zinc-900/90',
				'border border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]',
				'shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]',
				className,
			)}
			{...props}
		/>
	);
}

function Header({
	className,
	children,
	glassEffect = true,
	...props
}: React.ComponentProps<'div'> & {
	glassEffect?: boolean;
}) {
	return (
		<div
			className={cn(
				'relative mb-4 rounded-xl border p-6',
				'bg-linear-to-b from-white/80 via-gray-50/80 to-white/80 dark:from-zinc-800/80 dark:via-zinc-700/80 dark:to-zinc-800/80',
				'border-[rgba(230,230,230,0.5)] dark:border-[rgba(70,70,70,0.5)]',
				className,
			)}
			{...props}
		>
			{/* Top glass gradient */}
			{glassEffect && (
				<div
					aria-hidden="true"
					className="absolute inset-x-0 top-0 h-48 rounded-[inherit]"
					style={{
						background:
							'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 100%)',
					}}
				/>
			)}
			<div className="relative z-10">{children}</div>
		</div>
	);
}

function Plan({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('mb-6 flex items-center justify-between', className)}
			{...props}
		/>
	);
}

function Description({ className, ...props }: React.ComponentProps<'p'>) {
	return (
		<p className={cn('text-gray-600 dark:text-gray-400 text-xs mb-4', className)} {...props} />
	);
}

function PlanName({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				"text-gray-900 dark:text-white flex items-center gap-2 text-xl font-bold [&_svg:not([class*='size-'])]:size-5",
				className,
			)}
			{...props}
		/>
	);
}

function Badge({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn(
				'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full px-3 py-1 text-xs font-semibold',
				className,
			)}
			{...props}
		/>
	);
}

function Price({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('mb-6 flex items-end gap-1', className)} {...props} />
	);
}

function MainPrice({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn('text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white', className)}
			{...props}
		/>
	);
}

function Period({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn('text-gray-600 dark:text-gray-400 pb-1 text-sm', className)}
			{...props}
		/>
	);
}

function OriginalPrice({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn(
				'text-gray-500 dark:text-gray-500 mr-1 ml-auto text-lg line-through',
				className,
			)}
			{...props}
		/>
	);
}

function Body({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('space-y-6 p-6', className)} {...props} />;
}

function List({ className, ...props }: React.ComponentProps<'ul'>) {
	return <ul className={cn('space-y-4', className)} {...props} />;
}

function ListItem({ className, ...props }: React.ComponentProps<'li'>) {
	return (
		<li
			className={cn(
				'text-gray-700 dark:text-gray-300 flex items-start gap-3 text-sm',
				className,
			)}
			{...props}
		/>
	);
}

function Separator({
	children = 'Premium features',
	className,
	...props
}: React.ComponentProps<'div'> & {
	children?: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'text-gray-500 dark:text-gray-500 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider',
				className,
			)}
			{...props}
		>
			<span className="bg-gray-300 dark:bg-gray-600 h-[1px] flex-1" />
			<span className="text-gray-500 dark:text-gray-500 shrink-0">{children}</span>
			<span className="bg-gray-300 dark:bg-gray-600 h-[1px] flex-1" />
		</div>
	);
}

export {
	Card,
	Header,
	Description,
	Plan,
	PlanName,
	Badge,
	Price,
	MainPrice,
	Period,
	OriginalPrice,
	Body,
	List,
	ListItem,
	Separator,
};
