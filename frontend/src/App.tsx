import React, { useState } from 'react'

const App: React.FC = () => {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setError(false)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          from: name,
          message
        })
      })
      if (!res.ok)  {
        throw new Error('Invalid response code')
      }
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (e) {
      setIsSubmitting(false)
      setError(true)
    }
  }

  const onReset = (e: any) => {
    setIsSubmitting(false)
    setSubmitted(false)
    setError(false)
    setName('')
    setMessage('')
  }

  return (
    <div className="container">
      <h1>NYE 2k20 hat</h1>
      <p>Use the form below to send a message to be displayed on the NYE 2k20 hat.</p>
      {isSubmitting && (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          An error occured while sending your message. Try again.
        </div>
      )}
      {!isSubmitting && !submitted && (
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input type="text" className="form-control" maxLength={20} id="name" value={name} onChange={(e) => setName(e.currentTarget.value)} />
            <small className="form-text text-muted">Maximum 20 characters.</small>
          </div>
          <div className="form-group">
            <label htmlFor="message">Your message</label>
            <input type="text" className="form-control"maxLength={250} id="message" value={message} onChange={(e) => setMessage(e.currentTarget.value)} />
            <small className="form-text text-muted">Maximum 250 characters.</small>
          </div>
          <button type="submit" className="btn btn-primary">Send your message</button>
        </form>
      )}
      {submitted && (
        <>
          <div className="alert alert-success" role="alert">
            Your message has been sent. It will be displayed shortly.
          </div>
          <button type="button" className="btn btn-secondary" onClick={onReset}>Send another message</button>
        </>
      )}
    </div>
  )
}

export default App
