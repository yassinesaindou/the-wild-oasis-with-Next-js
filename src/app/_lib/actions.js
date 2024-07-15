'use server'
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { deleteBooking, updateGuest } from "./data-service";
import supabase from "./supabase";
import { redirect } from "next/navigation";

export async function signInAction() {
    await signIn('google',{redirectTo:'/account'})
}

export async function signOutAction() {
    await signOut({redirectTo:'/'})
}

export async function updateGuestAction(formData) {
    const session = await auth();
    if (!session) throw new Error('Not logged in');
    
    const nationalID = formData.get('nationalID');
    const [nationality, countryFlag] = formData.get('nationality').split('%');

    const updateData = { nationality, nationalID, countryFlag }
    console.log(updateData);
    
    await updateGuest(session.user.guestId, updateData);


    revalidatePath('/account/profile')
}

export async function deleteReservation(bookingId) {
    const session = await auth();
    if (!session) throw new Error('You Have to Login')
    
    await deleteBooking(bookingId)
    revalidatePath('/account/reservations')

}

export async function updateReservation(formData) {
    const session = await auth();
    if (!session) throw new Error('You Have to Login');

    const numGuests =Number(formData.get('numGuests'))
    const observations =  formData.get('observations')
    const bookingId = formData.get('bookingId')
    const updateData = {numGuests, observations}
    
    
    const {   error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", Number(bookingId))
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
    }
    revalidatePath('/account/reservations')
    revalidatePath(`/account/reservations/edit/${bookingId}`)

    redirect('/account/reservations')
}

export async function createReservation( reservationData, formData ) {
    const session = await auth();
    if (!session) throw new Error('You Have to Login');
 
    
 
     console.log(formData);

    const newBooking = {
        ...reservationData,
        guestId: session.user.guestId,
        numGuests :Number(formData.get('numGuests')),
        observations :formData.get('observations'),
        extraPrice: 0,
        totalPrice: reservationData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: 'unconfirmed'
    }
    
    const {   error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
     
  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
    revalidatePath(`cabins/${reservationData.cabinId}`)
    redirect('/account/reservations');
}