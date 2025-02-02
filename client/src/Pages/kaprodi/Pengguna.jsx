import React, { useEffect, useRef, useState } from "react";
import Tables from "../../components/Tables/Tables";
import ActionButton from "../../components/Buttons/ActionButton";
import { Edit, Plus, Trash2 } from "lucide-react";
import SearchingInput from "../../components/Inputs/SearchingInput";
import Button from "../../components/Buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../../redux/thunks/apiThunks";
import Loading from "../../components/Loader/Loading";
import Modal from "../../components/ModalBox/Modal";
import Input from "../../components/Inputs/Input";
import Notification from "../../components/Notifications/Notification";
import { useSelectedProperties } from "../../hooks/useGetSelectedProperty";
import RcPagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const locale = {
  prev_page: "Previous",
  next_page: "Next",
  jump_to: "Go to",
  jump_to_confirm: "Confirm",
  page: "Page",
  items_per_page: "items/page",
};

const ITEMS_PER_PAGE = 5;

function Pengguna() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.apiData.data);
  const loading = useSelector((state) => state.apiData.loading);
  const action = useSelector((state) => state.apiData.action);
  const message = useSelector((state) => state.apiData.message);
  const status = useSelector((state) => state.apiData.status);

  const notifRef = useRef();
  const roleRef = useRef();

  const [user, setUser] = useState({});
  const [value, setValue] = useState({});

  const [isModalTambah, setIsModalTambah] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (item, data) => {
    if (item === "tambah") {
      setIsModalTambah(true);
      return;
    }
    if (item === "edit") {
      setIsModalEdit(true);
      setUser(data);
      return;
    }
    if (item === "hapus") {
      setIsDeleteModal(true);
      setUser(data);
      return;
    }
  };

  const closeModal = () => {
    setIsModalTambah(false);
    setIsModalEdit(false);
    setIsDeleteModal(false);
  };

  useEffect(() => {
    dispatch(fetchData({ endpoint: "users" }));
  }, [dispatch]);

  useEffect(() => {
    if (isModalEdit) {
      roleRef.current.value = user.user;
    }
  }, [isModalEdit]);

  const handleInputValue = async (e, item, action) => {
    const inputvalue = e.target.value;
    if (action === "edit") {
      setValue({
        ...value,
        [item]: inputvalue,
      });
      return;
    }

    const addData = {
      ...value,
      [item]: inputvalue,
    };
    setValue(addData);
  };

  const handleAction = async (e, actionType) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (actionType === "tambah") {
      dispatch(postData({ endpoint: "users/add", data: value }));
      setIsModalTambah(false);
    }

    if (actionType === "hapus") {
      dispatch(deleteData({ endpoint: `users/delete/${user.id_pengguna}` }));
      setIsDeleteModal(false);
    }

    if (actionType === "edit") {
      const selectedProperties = useSelectedProperties(user, [
        "id_pengguna",
        "username",
        "user",
      ]);
      const updatedData = {
        ...selectedProperties,
        ...value,
      };

      dispatch(
        updateData({
          endpoint: `users/update/${user.id_pengguna}`,
          data: updatedData,
        })
      );
      setIsModalEdit(false);
      setValue({});
    }
  };

  return (
    <>
      <Notification
        text={message}
        status={status}
        state={action}
        notifRef={notifRef}
      />
      <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
        <h3 className="font-medium">Pengguna</h3>
      </div>
      {/* Table */}
      <div className="mb-16 mt-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
          <h4 className="font-medium">Daftar Pengguna</h4>
          <SearchingInput
            placeholder={"Cari Pengguna..."}
            searchType={"pengguna"}
          />
        </div>
        <Tables
          fields={["No", "ID Pengguna", "Username", "Role", ""]}
          gap={"1"}
        >
          {!loading ? (
            currentData.length > 0 ? (
              currentData.map((item, index) => (
                <div
                  key={`${item.id_pengguna}-${index}`}
                  className="min-w-[700px] sm:max-h-fit grid grid-cols-5 mb-7 text-sm-3 pb-2"
                  style={{ borderBottom: "1px solid #CCCCCC" }}
                >
                  <div className="overflow-x-auto">
                    {startIndex + index + 1}
                  </div>
                  <div className="overflow-x-auto">{item.id_pengguna}</div>
                  <div className="overflow-auto">{item.username}</div>
                  <div className="overflow-auto">{item.user}</div>
                  <div className="flex">
                    <ActionButton text={"Edit"}>
                      <Edit
                        className="cursor-pointer"
                        onClick={() => openModal("edit", users[index])}
                      />
                    </ActionButton>
                    <ActionButton text={"Hapus"}>
                      <Trash2
                        className="cursor-pointer"
                        onClick={() => {
                          openModal("hapus", users[index]);
                        }}
                      />
                    </ActionButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
                <p className="text-center col-span-10 italic">Data Kosong</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
              <div className="col-span-10 flex justify-center">
                <Loading />
              </div>
            </div>
          )}
        </Tables>
        <RcPagination
          current={currentPage}
          total={users.length}
          pageSize={ITEMS_PER_PAGE}
          onChange={handlePageChange}
          showQuickJumper
          locale={locale}
          showLessItems={true}
          hideOnSinglePage={false}
        />
        <Button
          text={"Tambah"}
          onClick={() => {
            openModal("tambah");
          }}
          className={"mt-2 ms-auto"}
        >
          <Plus size={20} />
        </Button>
      </div>

      <Modal className={"w-fit"} open={isModalTambah}>
        <Modal.ModalCustom
          onClose={() => {
            closeModal("tambah");
          }}
          title={"Tambah Users"}
          formClass={"grid grid-cols-2 gap-x-6"}
          action={true}
          onClick={(e) => {
            handleAction(e, "tambah");
          }}
        >
          <Input.TextInput
            label={"ID Pengguna (Optional)"}
            width={"full"}
            type={"text"}
            onChange={(e) => {
              handleInputValue(e, "id", "tambah");
            }}
          />
          <Input.TextInput
            label={"Username"}
            width={"full"}
            type={"text"}
            onChange={(e) => {
              handleInputValue(e, "username", "tambah");
            }}
          />
          <Input.TextInput
            label={"Password"}
            width={"full"}
            type={"text"}
            onChange={(e) => {
              handleInputValue(e, "password", "tambah");
            }}
          />
          <Input.SelectInput
            label={"Role"}
            width={"full"}
            value={["Akademik", "Kaprodi"]}
            onChange={(e) => {
              handleInputValue(e, "user", "tambah");
            }}
          />
        </Modal.ModalCustom>
      </Modal>
      <Modal className={"w-fit"} open={isModalEdit}>
        <Modal.ModalCustom
          onClose={() => {
            closeModal("edit");
          }}
          title={"Edit Users"}
          formClass={"grid grid-cols-2 gap-x-6"}
          action={true}
          onClick={(e) => {
            handleAction(e, "edit");
          }}
        >
          <Input.TextInput
            label={"ID Pengguna (Optional)"}
            width={"full"}
            value={user.id_pengguna}
            type={"text"}
            onChange={(e) => {
              handleInputValue(e, "id_pengguna", "edit");
            }}
          />
          <Input.TextInput
            label={"Username"}
            width={"full"}
            type={"text"}
            value={user.username}
            onChange={(e) => {
              handleInputValue(e, "username", "edit");
            }}
          />
          <Input.TextInput
            label={"Password (Optional)"}
            width={"full"}
            type={"text"}
            onChange={(e) => {
              handleInputValue(e, "password", "edit");
            }}
          />
          <Input.SelectInput
            label={"Role"}
            selected={user.user}
            width={"full"}
            value={["Akademik", "Kaprodi"]}
            onChange={(e) => {
              handleInputValue(e, "user", "edit");
            }}
            reference={roleRef}
          />
        </Modal.ModalCustom>
      </Modal>
      <Modal open={isDeleteModal}>
        <Modal.ModalCustom
          onClose={() => {
            closeModal("hapus");
          }}
          title={`Apakah anda yakin ingin menghapus pengguna '${user.username}'?`}
          formClass={"flex gap-2"}
        >
          <Button
            text={"Hapus"}
            className={"mt-2 ms-auto w-full justify-center"}
            onClick={(e) => {
              handleAction(e, "hapus");
            }}
          />
          <Button
            text={"Batal"}
            className={
              "mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"
            }
            onClick={(e) => {
              e.preventDefault();
              closeModal("hapus");
            }}
          />
        </Modal.ModalCustom>
      </Modal>
    </>
  );
}

export default Pengguna;
