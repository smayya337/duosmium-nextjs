'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { getClientComponentClient } from '@/lib/global/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long!' })
});

export default function Login({ searchParams }: { searchParams: any }) {
	const supabase = getClientComponentClient();
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});
	async function LogInEmailPassword(values: z.infer<typeof formSchema>) {
		const email = values.email;
		const password = values.password;
		if (!email || !password) {
			throw new Error('Missing fields!');
		}
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.toString(),
			password: password.toString()
		});
		if (error) {
			toast({
				title: 'Login failed!',
				description: error.message
			});
		}
		if (data.user?.email?.endsWith('duosmium.org') && !data.user?.user_metadata.admin) {
			await supabase.auth.updateUser({
				data: {
					admin: true
				}
			});
		}
		if (searchParams.next) {
			router.push(searchParams.next);
		} else {
			router.push('/');
		}
	}
	return (
		<>
			<h1 className={'text-center tracking-tight font-bold text-4xl'}>Login</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(LogInEmailPassword)} className="space-y-8">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type="submit">Login</Button>
				</form>
			</Form>
		</>
	);
}
