import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(req, { params }) {
	try {

		const { userId } = params;
		console.log(`User ID: ${userId}`);


		if (!userId || userId === 'status') {
			return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
		}


		const { status } = await req.json();

		if (status == null) {
			return NextResponse.json({ message: 'Missing status' }, { status: 400 });
		}


		const boolStatus = status === 'true' || status === true;


		const { data: user, error: fetchError } = await supabase.from('users').select('id, status').eq('id', userId).single();

		if (fetchError || !user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}


		const { error: updateError, data: updatedUser } = await supabase
			.from('users')
			.update({ status: boolStatus })
			.eq('id', userId)
			.select();

		console.log('Updated User:', updatedUser);
		if (updateError) {
			console.error('Update Error:', updateError);
			return NextResponse.json({ message: 'Failed to update status' }, { status: 500 });
		}

		return NextResponse.json({ message: 'User status updated successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error in POST request:', error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
