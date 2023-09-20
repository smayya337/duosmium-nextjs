import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';
import { getServerComponentClient } from '@/lib/global/supabase';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export async function SiteHeader() {
	const {
		data: { user }
	} = await getServerComponentClient(cookies).auth.getUser();
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<MainNav items={siteConfig.mainNav} />
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-1">
						<Link
							href={siteConfig.links.github}
							target="_blank"
							rel="noreferrer"
							className={'hidden lg:flex'}
						>
							<div
								className={buttonVariants({
									size: 'sm',
									variant: 'ghost'
								})}
							>
								<Icons.gitHub className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>
						<ThemeToggle />
						{user && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Avatar>
											<AvatarFallback>ME</AvatarFallback>
										</Avatar>
									</TooltipTrigger>
									<TooltipContent>
										<p>You are an administrator!</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
