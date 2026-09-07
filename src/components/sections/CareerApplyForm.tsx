'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile } from '@marsidev/react-turnstile'

import { ChevronRightIcon } from '@/components/icons'
import { Container, Button, Heading, Prose } from '@/components/ui'
import {
  ACCEPTED_FILE_EXTENSIONS,
  EXPERIENCE_OPTIONS,
  FILE_ACCEPT_ATTRIBUTE,
  GENDER_OPTIONS,
  PROVINCE_OPTIONS,
  RACE_OPTIONS,
  TITLE_OPTIONS,
  YES_NO_OPTIONS,
  careerApplicationSchema,
  validateApplicationFile,
  type CareerApplicationInput,
} from '@/lib/careerApplicationSchema'

/**
 * Career application form. Per Figma: desktop nodes 1:13284 (careers/apply) and
 * 450:1480 (the form block), mobile node 1:20935.
 *
 * Desktop is the design's two-column grid inside a 1240px container padded 70px
 * each side — a 307px label column beside the control column, 32px between rows,
 * and 100px between the titled sections, though the documents and eligibility
 * blocks sit closer at 52px. Below 1025 the mobile frame stacks every row (label
 * above control, 30px apart), insets the content 26px, widens both file buttons
 * and the submit button to full width, and opens the rhythm out to 40px between
 * rows, 80px between titled sections and 40px for those two closer blocks.
 *
 * Submits `multipart/form-data` to /api/careers/apply because the three
 * documents ride along with the fields; validation is the shared zod schema
 * so client and server agree.
 */

/** Figma nodes 1:13350 etc. — Roboto Regular 13/12 at 10% tracking, brand at 80%. */
const LABEL_CLASSES = 'font-body text-13 leading-12 tracking-10 text-brand/80 capitalize'

/**
 * Figma nodes 1:13359 etc. — 1px sage border, 5px radius, 25px of side padding,
 * 13px placeholder at 5% tracking in ink at 60%. Shared by every control; the
 * height is added per control type below.
 */
const CONTROL_BASE =
  'w-full rounded-5 border border-brand-muted bg-transparent px-25 font-body text-13 leading-12 tracking-5 text-ink backdrop-blur-[1px] transition-colors duration-300 placeholder:text-ink/60 placeholder:capitalize focus:border-brand focus:outline-none'

/**
 * Single-line inputs and selects are a fixed 37px in the design (e.g. node 1:13351),
 * so the height is set outright rather than left to padding — border-box means the
 * 1px border is inside that 37px, and inputs centre their own text vertically.
 */
const FIELD_CLASSES = `${CONTROL_BASE} h-37`

/** The cover-note textarea grows instead: 121px on mobile (node 1:20965), 110px on desktop. */
const TEXTAREA_CLASSES = `${CONTROL_BASE} min-h-121 py-15 leading-copy 1024:min-h-110`

const ERROR_CLASSES = 'font-body text-12 leading-copy tracking-5 text-red-700'

/**
 * Figma nodes 1:13486 (desktop) / 1:20957 (mobile) — the "Choose file" affordance:
 * same outline as .btn-glass, 14px label at 5%. Full width below 1025, per the mobile frame.
 */
const CHOOSE_FILE_CLASSES =
  'inline-flex w-full cursor-pointer items-center justify-center rounded-5 border border-brand-muted px-25 py-15 font-body text-14 leading-12 tracking-5 text-brand uppercase backdrop-blur-[1px] transition-colors duration-300 hover:bg-brand hover:text-paper focus-within:border-brand 1024:w-auto'

/**
 * Figma nodes 1:13489 (desktop) / 1:21066 (mobile) — the filled "Upload" button:
 * brand fill, 40px tall, 20/15 padding, 14px label at 5%. Also full width on mobile.
 */
const UPLOAD_CLASSES =
  'inline-flex h-40 w-full cursor-pointer items-center justify-center rounded-5 bg-brand px-20 font-body text-14 leading-12 tracking-5 text-paper uppercase transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand 1024:w-auto'

type FileKey = 'cv' | 'idDocument' | 'qualification'

const REQUIRED_FILES: FileKey[] = ['cv', 'idDocument', 'qualification']

/** Shown when a required document is missing entirely. */
const FILE_LABELS: Record<FileKey, string> = {
  cv: 'Please attach your CV',
  idDocument: 'Please attach a copy of your ID document',
  qualification: 'Please attach your qualification document',
}

/** Shown when a file has been chosen but the row's Upload step hasn't been run. */
const NOT_UPLOADED_MESSAGE = 'Press Upload to attach this file'

type FileState = { selected: File | null; attached: File | null }

const EMPTY_FILE_STATE: FileState = { selected: null, attached: null }

/**
 * One label + control row. Two columns from 1025 up (Figma node 1:13345);
 * stacked with a 30px gap below that, per the mobile frame (node 1:20972).
 */
function Row({
  label,
  htmlFor,
  error,
  alignTop,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  /**
   * Line the label up with the first line of a tall control instead of centring it
   * against the whole box — the cover-note row in Figma (label 1:13338 at y=1271,
   * textarea 1:13342 from y=1256 with 15px of padding, so the two share a baseline).
   */
  alignTop?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`grid gap-30 1024:grid-cols-[307px_minmax(0,1fr)] 1024:gap-0 ${
        alignTop ? '1024:items-start' : '1024:items-center'
      }`}
    >
      <label htmlFor={htmlFor} className={`${LABEL_CLASSES} ${alignTop ? '1024:pt-15' : ''}`}>
        {label}
      </label>
      <div className="flex min-w-0 flex-col gap-8">
        {children}
        {error && <span className={ERROR_CLASSES}>{error}</span>}
      </div>
    </div>
  )
}

/** Native select styled to the design, with the design's own 10×6 chevron. */
function Select({
  id,
  options,
  register,
}: {
  id: string
  options: readonly string[]
  register: React.ComponentProps<'select'>
}) {
  return (
    <div className="relative">
      <select id={id} defaultValue="" className={`${FIELD_CLASSES} appearance-none pr-60`} {...register}>
        <option value="" disabled>
          Select...
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronRightIcon
        className="pointer-events-none absolute top-1/2 right-25 h-10 w-6 -translate-y-1/2 rotate-90 text-brand/80"
      />
    </div>
  )
}

/**
 * Figma nodes 1:13492 / 1:13483 — file picker, chosen-file name, accepted-formats note.
 *
 * The ID and qualification rows carry the design's filled "Upload" button. It is
 * never disabled: pressed with a file already chosen it validates and attaches
 * that file; pressed with nothing chosen it opens the picker and attaches
 * whatever is chosen, so one press does the whole job either way. The CV row has
 * no Upload button in the design, so it attaches straight off the picker.
 */
function FileRow({
  label,
  id,
  state,
  error,
  withUploadStep,
  withFormatNote,
  onSelect,
  onUpload,
}: {
  label: string
  id: string
  state: FileState
  error?: string
  withUploadStep?: boolean
  /** The accepted-formats line sits under the ID and qualification rows only, not the CV row. */
  withFormatNote?: boolean
  onSelect: (file: File | null, attachImmediately?: boolean) => void
  onUpload?: () => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  /** Set when the picker was opened by Upload, so the chosen file attaches without a second press. */
  const attachOnPick = React.useRef(false)

  const attached = state.attached
  const staged = state.selected

  function handleUpload() {
    if (staged) {
      onUpload?.()
      return
    }
    attachOnPick.current = true
    inputRef.current?.click()
  }

  const status = attached
    ? `${attached.name} — attached`
    : staged
      ? staged.name
      : 'No file chosen'

  return (
    // `alignTop` keeps the label level with the Choose file button rather than with the
    // centre of the whole cell — otherwise the accepted-formats note drags it down.
    <Row label={label} htmlFor={id} error={error} alignTop>
      {/* Mobile (node 1:21055) stacks the picker, the filename and Upload full-width; from
          1025 up (node 1:13483) they sit on one row. */}
      <div className="flex flex-col gap-20 1024:gap-15">
        <div className="flex flex-col gap-25 1024:flex-row 1024:flex-wrap 1024:items-center 1024:gap-32">
          <label className={CHOOSE_FILE_CLASSES}>
            Choose file
            <input
              ref={inputRef}
              id={id}
              type="file"
              accept={FILE_ACCEPT_ATTRIBUTE}
              className="sr-only"
              onChange={(event) => {
                const immediate = attachOnPick.current
                attachOnPick.current = false
                onSelect(event.target.files?.[0] ?? null, immediate)
              }}
            />
          </label>

          <span
            className={`font-body text-15 leading-muted font-light tracking-5 text-center 1024:text-left ${
              attached ? 'text-brand' : 'text-ink/80'
            }`}
          >
            {status}
          </span>

          {withUploadStep && (
            <button type="button" onClick={handleUpload} className={UPLOAD_CLASSES}>
              Upload
            </button>
          )}
        </div>
        {withFormatNote && (
          <p className="font-body text-12 leading-muted font-light tracking-5 text-ink/50 text-center 1024:text-left">
            Accepted: {ACCEPTED_FILE_EXTENSIONS.join(' ')} — max 5000KB
          </p>
        )}
      </div>
    </Row>
  )
}

export function CareerApplyForm({ position }: { position: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [token, setToken] = React.useState<string>()
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [files, setFiles] = React.useState<Record<FileKey, FileState>>({
    cv: EMPTY_FILE_STATE,
    idDocument: EMPTY_FILE_STATE,
    qualification: EMPTY_FILE_STATE,
  })
  const [fileErrors, setFileErrors] = React.useState<Partial<Record<FileKey, string>>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CareerApplicationInput>({
    resolver: zodResolver(careerApplicationSchema),
    defaultValues: { position },
  })

  /**
   * Staging step. `attachImmediately` is set for the CV row, which has no
   * Upload button in the design.
   */
  function selectFile(key: FileKey, file: File | null, attachImmediately = false) {
    const message = file ? validateApplicationFile(file) : null
    setFiles((current) => ({
      ...current,
      [key]: message || !file ? EMPTY_FILE_STATE : { selected: file, attached: attachImmediately ? file : null },
    }))
    setFileErrors((current) => ({ ...current, [key]: message ?? undefined }))
  }

  /** The design's Upload button: re-validate the staged file, then attach it. */
  function uploadFile(key: FileKey) {
    const staged = files[key].selected
    if (!staged) return

    const message = validateApplicationFile(staged)
    setFileErrors((current) => ({ ...current, [key]: message ?? undefined }))
    if (message) {
      setFiles((current) => ({ ...current, [key]: EMPTY_FILE_STATE }))
      return
    }
    setFiles((current) => ({ ...current, [key]: { selected: staged, attached: staged } }))
  }

  async function onSubmit(values: CareerApplicationInput) {
    const missing: Partial<Record<FileKey, string>> = {}
    for (const key of REQUIRED_FILES) {
      const { selected, attached } = files[key]
      if (attached) continue
      missing[key] = selected ? NOT_UPLOADED_MESSAGE : FILE_LABELS[key]
    }
    if (Object.keys(missing).length > 0) {
      setFileErrors((current) => ({ ...current, ...missing }))
      return
    }

    setStatus('sending')

    const body = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null) body.append(key, String(value))
    }
    if (token) body.append('turnstileToken', token)
    for (const key of REQUIRED_FILES) {
      const file = files[key].attached
      if (file) body.append(key, file, file.name)
    }

    const res = await fetch('/api/careers/apply', { method: 'POST', body })
    setStatus(res.ok ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <section className="general-padding">
        <Container variant="lg">
          <div className="mx-auto flex w-full max-w-1240 flex-col gap-35 px-11 1024:px-70">
            <Heading level={2} size={4}>
              Application received
            </Heading>
            <Prose color="ink-light">
              Thank you for applying for the {position} role. Our people team reviews every application and will be
              in touch if your experience matches what we are looking for.
            </Prose>
          </div>
        </Container>
      </section>
    )
  }

  return (
    // Not `general-padding`: the banner sits closer on mobile than on desktop — 130px from
    // the banner's bottom edge to "Application details" at 1440 (banner ends 892, heading
    // 1:13310 at 1022), 100px on the mobile frame (941 → node 1:20948 at 1041).
    <section className="pt-100 pb-100 1024:pt-130">
      <Container variant="lg">
        {/* Figma node 450:1480 — 1240px form container with 70px of padding down each side.
            Below 1025 the mobile frame (node 1:20935) insets the content 26px: the 15px from
            Container plus the 11px here, the same pairing CareerListing uses. */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto w-full max-w-1240 px-11 1024:px-70">
          <input type="hidden" {...register('position')} />

          {/* ---- Application details — Figma node 1:13307 ---- */}
          <div className="flex flex-col gap-35">
            <Heading level={2} size={4}>
              Application details
            </Heading>
            <Prose color="ink-light">Fields marked * are mandatory and must be completed.</Prose>
          </div>

          {/* Figma node 1:13344 — the rule closing this half spans the full 1240 container, so
              the block reaches back out through the form's 70px padding and pads itself in
              again, keeping the content where it is while the border runs edge to edge. */}
          <div className="mt-80 flex flex-col gap-40 border-b border-brand-muted/30 pb-80 1024:mt-100 1024:-mx-70 1024:gap-32 1024:px-70 1024:pb-100">
            <FileRow
              label="* Upload your CV"
              id="cv"
              state={files.cv}
              error={fileErrors.cv}
              onSelect={(file) => selectFile('cv', file, true)}
            />

            <Row label="Cover note" htmlFor="coverNote" error={errors.coverNote?.message} alignTop>
              <textarea
                id="coverNote"
                rows={4}
                placeholder="Cover notes"
                className={TEXTAREA_CLASSES}
                {...register('coverNote')}
              />
            </Row>
          </div>

          {/* ---- Personal details — Figma nodes 1:13312 / 1:13345 ---- */}
          <Heading level={2} size={4} className="mt-80 block 1024:mt-100">
            Personal details
          </Heading>

          <div className="mt-80 flex flex-col gap-40 1024:mt-100 1024:gap-32">
            <Row label="Title" htmlFor="title" error={errors.title?.message}>
              <Select id="title" options={TITLE_OPTIONS} register={register('title')} />
            </Row>

            <Row label="* First name" htmlFor="firstName" error={errors.firstName?.message}>
              <input id="firstName" placeholder="First name" className={FIELD_CLASSES} {...register('firstName')} />
            </Row>

            <Row label="* Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <input id="lastName" placeholder="Last name" className={FIELD_CLASSES} {...register('lastName')} />
            </Row>

            <Row label="* Email address" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email address"
                className={`${FIELD_CLASSES} normal-case`}
                {...register('email')}
              />
            </Row>

            <Row label="Mobile phone" htmlFor="mobilePhone" error={errors.mobilePhone?.message}>
              <input
                id="mobilePhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Mobile phone"
                className={FIELD_CLASSES}
                {...register('mobilePhone')}
              />
            </Row>

            <Row label="Home phone" htmlFor="homePhone" error={errors.homePhone?.message}>
              <input
                id="homePhone"
                type="tel"
                inputMode="tel"
                placeholder="Home phone..."
                className={FIELD_CLASSES}
                {...register('homePhone')}
              />
            </Row>
          </div>

          {/* ---- Documents — Figma nodes 1:13492 / 1:13483 ----
              Sits closer to the block above than the other sections do: 52px on desktop
              (personal rows end 2074, this starts 2126), 40px on mobile (node 1:21055). */}
          <div className="mt-40 flex flex-col gap-40 1024:mt-52 1024:gap-32">
            <FileRow
              label="* Copy of ID document"
              id="idDocument"
              state={files.idDocument}
              error={fileErrors.idDocument}
              withUploadStep
              withFormatNote
              onSelect={(file, immediate) => selectFile('idDocument', file, immediate)}
              onUpload={() => uploadFile('idDocument')}
            />
            <FileRow
              label="* Qualification document"
              id="qualification"
              state={files.qualification}
              error={fileErrors.qualification}
              withUploadStep
              withFormatNote
              onSelect={(file, immediate) => selectFile('qualification', file, immediate)}
              onUpload={() => uploadFile('qualification')}
            />
          </div>

          {/* ---- Eligibility and employment — Figma node 1:13389 ----
              Same 52/40 gap as the documents block above it (qualification row ends 2281,
              this starts 2332). */}
          <div className="mt-40 flex flex-col gap-40 1024:mt-52 1024:gap-32">
            <Row
              label="* Eligible to work in South Africa?"
              htmlFor="eligibleToWork"
              error={errors.eligibleToWork?.message}
            >
              <Select id="eligibleToWork" options={YES_NO_OPTIONS} register={register('eligibleToWork')} />
            </Row>

            <Row
              label="Were you born in South Africa?"
              htmlFor="bornInSouthAfrica"
              error={errors.bornInSouthAfrica?.message}
            >
              <Select id="bornInSouthAfrica" options={YES_NO_OPTIONS} register={register('bornInSouthAfrica')} />
            </Row>

            <Row
              label="Are you a naturalised citizen?"
              htmlFor="naturalisedCitizen"
              error={errors.naturalisedCitizen?.message}
            >
              <Select id="naturalisedCitizen" options={YES_NO_OPTIONS} register={register('naturalisedCitizen')} />
            </Row>

            <Row label="* ID number" htmlFor="idNumber" error={errors.idNumber?.message}>
              <input id="idNumber" placeholder="ID number" className={FIELD_CLASSES} {...register('idNumber')} />
            </Row>

            <Row label="* Gender" htmlFor="gender" error={errors.gender?.message}>
              <Select id="gender" options={GENDER_OPTIONS} register={register('gender')} />
            </Row>

            <Row label="* Race" htmlFor="race" error={errors.race?.message}>
              <Select id="race" options={RACE_OPTIONS} register={register('race')} />
            </Row>

            <Row label="* Are you disabled?" htmlFor="disabled" error={errors.disabled?.message}>
              <Select id="disabled" options={YES_NO_OPTIONS} register={register('disabled')} />
            </Row>

            <Row
              label="* Highest qualification"
              htmlFor="highestQualification"
              error={errors.highestQualification?.message}
            >
              <input
                id="highestQualification"
                placeholder="Highest qualification..."
                className={FIELD_CLASSES}
                {...register('highestQualification')}
              />
            </Row>

            <Row label="* Years of experience" htmlFor="yearsOfExperience" error={errors.yearsOfExperience?.message}>
              <Select id="yearsOfExperience" options={EXPERIENCE_OPTIONS} register={register('yearsOfExperience')} />
            </Row>

            <Row label="* Current province" htmlFor="currentProvince" error={errors.currentProvince?.message}>
              <Select id="currentProvince" options={PROVINCE_OPTIONS} register={register('currentProvince')} />
            </Row>

            <Row label="* Current employer" htmlFor="currentEmployer" error={errors.currentEmployer?.message}>
              <input
                id="currentEmployer"
                placeholder="Current employer"
                className={FIELD_CLASSES}
                {...register('currentEmployer')}
              />
            </Row>

            <Row label="* Current position" htmlFor="currentPosition" error={errors.currentPosition?.message}>
              <input
                id="currentPosition"
                placeholder="Current position..."
                className={FIELD_CLASSES}
                {...register('currentPosition')}
              />
            </Row>
          </div>

          {/* ---- Consent, verification and submit ----
              Desktop (nodes 1:13501 / 1:13303) puts both in the control column, not under
              the labels. Mobile (nodes 1:21086 / 1:21083) runs them full width. */}
          <div className="mt-40 flex flex-col gap-50 1024:mt-37 1024:grid 1024:grid-cols-[307px_minmax(0,1fr)] 1024:gap-0">
            <div className="flex flex-col gap-50 1024:col-start-2 1024:gap-48">
              <label className="flex items-center gap-9">
                <input
                  type="checkbox"
                  className="size-14 shrink-0 cursor-pointer appearance-none rounded-3 border border-brand-muted transition-colors duration-300 checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  {...register('sendCopy')}
                />
                <span className="font-body text-10 leading-23 tracking-5 text-brand/80 capitalize">
                  I wish to receive a copy of this application
                </span>
              </label>

              {siteKey && <Turnstile siteKey={siteKey} onSuccess={setToken} />}

              <div className="flex flex-col items-stretch gap-20 1024:items-start">
                <Button
                  type="submit"
                  variant="solid"
                  color="brand"
                  disabled={isSubmitting}
                  className="w-full justify-center 1024:w-auto"
                >
                  {status === 'sending' ? 'Sending…' : 'Apply now'}
                </Button>

                {status === 'error' && (
                  <p className={ERROR_CLASSES}>
                    Something went wrong sending your application. Please try again, or email us directly.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </Container>
    </section>
  )
}
