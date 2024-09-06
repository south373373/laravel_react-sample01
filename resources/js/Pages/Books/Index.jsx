// Dashboardのデータを参照にして作成
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// 
import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
// 新規作成したボタン
import BlueButton from '@/Components/BlueButton';
import GreenButton from '@/Components/GreenButton';
// 新規作成したcomponent
import TextareaInput from '@/Components/TextareaInput';
import Select from '@/Components/Select';


export default function Dashboard({ auth, books, message }) {
    // 定義を追記。returnの前に記載。
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    // 新規に定義
    const [confirmingBookUpdate, setConfirmingBookUpdate] = useState(false);
    const passwordInput = useRef();
    const titleInput = useRef();
    const contentInput = useRef();
    const categoryInput = useRef();

    const {
        data,
        setData,
        // post・putを追記
        delete: destroy,post,put,
        processing,
        reset,
        errors,
    } = useForm({
        // title・content・categoryを追記
        password: '',title: '',content: '',category: ''
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    // 新規に追記・引数にcolumn名を指定。
    const confirmBookUpdate = (id,title,content,category) => {
        setData({id:id, title:title, content:content, category:category});
        setConfirmingBookUpdate(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        post(route('books.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    // 新規に作成
    const updateBook = (e) => {
        e.preventDefault();

        put(route('books.update',data.id), {
            preserveScroll: true,
            onSuccess: () => closeModal_u(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    // 新規に作成
    const deleteBook = (id) => {
        destroy(route('books.destroy',id), {
            preserveScroll: true,
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    // 新規に作成
    const closeModal_u = () => {
        setConfirmingBookUpdate(false);

        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* 以下のbuttonとmodalはDeleteUserForm.jsxから流用 */}

                {/* <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton> */}
                {/* PrimaryButtonを使用する際には上部に、componentsからimportする記述を記載 */}
                <BlueButton onClick={confirmUserDeletion}>登録</BlueButton>

                {/* モーダル画面の定義 */}
                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={deleteUser} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Are you sure you want to insert new book?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">

                        </p>

                        <div className="mt-6">
                            <InputLabel htmlFor="text" value="title" className="sr-only" />

                            <TextInput
                                id="title"
                                type="text"
                                name="title"
                                ref={titleInput}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="title"
                            />

                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* content用 */}
                        <div className="mt-6">
                            <InputLabel htmlFor="text" value="content" className="sr-only" />
                            
                            <TextareaInput
                                id="content"
                                type="text"
                                name="content"
                                ref={contentInput}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="content"
                            >
                            </TextareaInput>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        {/* category用 */}
                        <div className="mt-6">
                            <Select
                                id="category"
                                name="category"
                                ref={categoryInput}
                                value={data.category}
                                required='required'
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-3/4"
                                placeholder="category"
                                options={['', 'React', 'Vue', 'laravel']}
                            >
                            </Select>
                            <InputError message={errors.category} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal_u}>Cancel</SecondaryButton>

                            <BlueButton className="ms-3" disabled={processing}>
                                登録する
                            </BlueButton>
                        </div>
                    </form>
                </Modal>

                {/* 新規に作成 */}
                {/* 
                    誤って「<Modal show={setConfirmingBookUpdate} onClose={closeModal_u}>」と記載した。
                    showプロパティにsetConfirmingBookUpdateが直接渡されていますが、
                    setConfirmingBookUpdateは状態を設定する関数です。
                    そのため、showプロパティにsetConfirmingBookUpdateが渡されると、常に真（true）と解釈され、
                    モーダルが表示されることになるので注意。

                    以下の様に修正して、showプロパティには、モーダルの表示を制御するための状態変数
                    （confirmingBookUpdate）を渡す必要がある。
                 */}
                <Modal show={confirmingBookUpdate} onClose={closeModal_u}>
                    <form onSubmit={updateBook} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Are you sure you want to update this book?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">

                        </p>

                        <div className="mt-6">
                            <TextInput
                                id="title"
                                type="text"
                                name="title"
                                ref={titleInput}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="title"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* content用 */}
                        <div className="mt-6">
                            <TextareaInput
                                id="content"
                                type="text"
                                name="content"
                                ref={contentInput}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="content"
                            >
                            </TextareaInput>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        {/* category用 */}
                        <div className="mt-6">
                            <Select
                                id="category"
                                name="category"
                                ref={categoryInput}
                                value={data.category}
                                required='required'
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="category"
                                options={['', 'React', 'Vue', 'laravel']}
                            >
                            </Select>
                            <InputError message={errors.category} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal_u}>Cancel</SecondaryButton>

                            <BlueButton className="ml-3" disabled={processing}>
                                更新する
                            </BlueButton>
                        </div>
                    </form>
                </Modal>
                
                {/* 処理実行時のflashメッセージの出力を定義 */}
                {message && <div className="mt-2 text-blue-900  bg-green-100 p-3 rounded-lg text-center font-bold">{message}</div>}

                    {/* 以下の追記を実施。Booksのデータの一覧を表示。 */}
                    <div>
                        <table className="w-full bg-gray-100 mt-2">
                            <thead className="bg-blue-100">
                                <tr className='text-green-600'>
                                    <th className='px-2 py-2 border border-gray-400'>#</th>
                                    <th className='px-2 py-2 border border-gray-400'>タイトル</th>
                                    <th className='px-2 py-2 border border-gray-400'>内容</th>
                                    <th className='px-2 py-2 border border-gray-400'>カテゴリー</th>
                                    <th className='px-2 py-2 border border-gray-400'>-</th>
                                    <th className='px-2 py-2 border border-gray-400'>-</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {books.map((book) => (
                                    <tr key={book.id}>
                                        <td className='border border-gray-400 px-2 py-2 text-center'>{book.id}</td>
                                        <td className='border border-gray-400 px-2 py-2'>{book.title}</td>
                                        <td className='border border-gray-400 px-2 py-2'>{book.content}</td>
                                        <td className='border border-gray-400 px-2 py-2'>{book.category}</td>
                                        <td className='border border-gray-400 px-2 py-2 text-center'>
                                            {/* 追記 */}
                                            <GreenButton onClick={() => confirmBookUpdate(book.id, book.title, book.content, book.category)}>
                                                編集
                                            </GreenButton>
                                        </td>
                                        <td className='border border-gray-400 px-2 py-2 text-center'>
                                            <DangerButton onClick={() => deleteBook(book.id)}>
                                                削除
                                            </DangerButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
