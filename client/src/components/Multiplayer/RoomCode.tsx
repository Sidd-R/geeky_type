import { useRouter } from 'next/router';
import * as React from 'react';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Code() {
  // const { query } = useRouter();

  return (
    <span
      // onClick={() =>
        // navigator.clipboard.writeText(query?.id as string).then(() =>
        //   toast.success('Copied successfully!', {
        //     position: toast.POSITION.TOP_CENTER,
        //     toastId: 'copy-success',
        //     autoClose: 3000,
        //   })
        // )
      // }
      className='relative z-10 flex cursor-pointer items-center rounded-md bg-hl px-4 pt-5 text-3xl font-bold text-bg'
    >
       
    </span>
  );
}
