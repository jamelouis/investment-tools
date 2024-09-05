import BookList from '@/app/components/BookList';

import book_lists from '@/data/book_lists.json'

  export async function generateStaticParams() {
    return book_lists.map(book_list => {
        return {
            "name": book_list.name
        }
    });
}

   
export default function Page({ params }: { params: { name: string } }) {
    return <BookList name={ params.name} /> 
}