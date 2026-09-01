import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalComponent } from "components/modal/Modal";
import {
  JOB_DETAILS_FIELDS,
  INITIAL_VALUES,
  getStyle,
  Fields,
  getIsButtonDisabled,
  handleFormatSalary,
  openLink,
} from "./helpers";
import { closeModal, selectModal } from "reducers/modalSlice";
import InputAdornment from "@mui/material/InputAdornment";
import { JOB_SEARCH } from "utils/constants";
import { JobModalTitle } from "./JobModalTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../../components/tabPanel/TabPanel";
import { ContactsTab } from "./ContactsTab";
import styles from "./JobModal.module.css";
import { useParams } from "react-router-dom";
import { useLazyGetJobQuery, useUpdateJobMutation } from "api/jobsApi";
import { toast } from "react-hot-toast";
import type { Job } from "./types";
import { useDeleteCardMutation } from "api/boardApi";
import { Button, MenuItem } from "@mui/material";

export const JobModal = () => {
  const dispatch = useDispatch();
  const { boardID = "" } = useParams();
  const { modalProps } = useSelector(selectModal);
  const { id: cardID, listID } = modalProps || {};
  const [liked, setLiked] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [updateJob] = useUpdateJobMutation();
  const [getJob, { data: job }] = useLazyGetJobQuery();

  useEffect(() => {
    setTabIndex(0);
    if (cardID) {
      getJob({ cardID });
    }
  }, [cardID, getJob]);

  const [deleteCard] = useDeleteCardMutation();
  const [formData, setFormData] = useReducer(
    (state: Job, newState: Job) => ({
      ...state,
      ...newState,
    }),
    INITIAL_VALUES
  );

  useEffect(() => {
    setFormData(INITIAL_VALUES);
    if (job) {
      setFormData(job);
      setLiked(job.isFavorite);
    }
  }, [job, modalProps]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value } as unknown as Job);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newFormData = {
      ...formData,
      isFavorite: liked,
    };
    if (cardID && job && boardID) {
      updateJob({
        ...newFormData,
        id: job._id,
        boardID,
        cardID,
        listID,
      })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          dispatch(closeModal());
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const handleDeleteCardAndJob = useCallback(() => {
    if (cardID && listID && boardID) {
      deleteCard({ id: cardID, listID, boardID })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
        });
    }
  }, [boardID, cardID, deleteCard, listID]);

  const handleChangeTab = (_event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const isButtonDisabled = getIsButtonDisabled(formData, job);

  if (!job) return null;

  return (
    <ModalComponent
      name={JOB_SEARCH}
      isButtonDisabled={isButtonDisabled}
      title={
        <JobModalTitle
          cardTitle={formData.companyName}
          dispatch={dispatch}
          liked={liked}
          setLiked={setLiked}
          isFavorite={formData.isFavorite}
        />
      }
      handleSubmit={handleSubmit}
      secondaryAction={{
        hide: false,
        onSecondaryAction: handleDeleteCardAndJob,
      }}
      stylesWrapper={{ marginTop: "30px" }}
    >
      <Tabs value={tabIndex} onChange={handleChangeTab} className={styles.tabs}>
        <Tab label="Job Details" />
        <Tab label="Contacts" />
      </Tabs>
      <form onSubmit={handleSubmit}>
        <TabPanel value={tabIndex} index={0}>
          <div className={styles.tabContainer}>
            <div className={styles.inputContainer}>
              {JOB_DETAILS_FIELDS.map(
                ({
                  name,
                  label,
                  type = "text",
                  icon,
                  required,
                  options,
                  placeholder,
                }) => {
                  const isTextArea = type === "textarea";
                  const style = getStyle(isTextArea, name);
                  const isError =
                    required && !formData[name as keyof typeof formData];

                  if (options) {
                    return (
                      <TextField
                        slotProps={{ inputLabel: { shrink: true } }}
                        key={name}
                        style={style}
                        name={name}
                        select
                        label={label}
                        variant="outlined"
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        error={isError}
                      >
                        {options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }

                  if (name !== Fields.link) {
                    return (
                      <TextField
                        key={name}
                        style={style}
                        name={name}
                        type="text"
                        label={label}
                        variant="outlined"
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        multiline={isTextArea}
                        minRows={isTextArea ? 4 : 1}
                        required={required}
                        error={isError}
                        onBlur={() =>
                          handleFormatSalary(name, formData, setFormData)
                        }
                        slotProps={{
                          inputLabel: { shrink: true },
                          input: icon
                            ? {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {icon}
                                  </InputAdornment>
                                ),
                              }
                            : undefined,
                        }}
                      />
                    );
                  }

                  return (
                    <TextField
                      key={name}
                      className={styles.linkInput}
                      style={style}
                      name={name}
                      type="text"
                      label={label}
                      placeholder={placeholder}
                      variant="outlined"
                      value={formData[name as keyof typeof formData]}
                      onChange={handleChange}
                      error={isError}
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: formData[Fields.link]
                          ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    onClick={(
                                      e: MouseEvent<HTMLButtonElement>
                                    ) => {
                                      e.preventDefault();
                                      openLink(formData[Fields.link]);
                                    }}
                                  >
                                    visit
                                  </Button>
                                </InputAdornment>
                              ),
                            }
                          : undefined,
                      }}
                    />
                  );
                }
              )}
            </div>

            <TextField
              className={styles.inputDescription}
              name={Fields.description}
              label="Job Description"
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
              multiline
              minRows={18}
            />
          </div>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <ContactsTab formData={formData} setFormData={setFormData} />
        </TabPanel>
      </form>
    </ModalComponent>
  );
};
