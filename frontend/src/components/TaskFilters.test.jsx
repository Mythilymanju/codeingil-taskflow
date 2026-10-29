import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskFilters from './TaskFilters'

const empty = { project_id: '', status: '', priority: '' }

test('clear button is disabled until a filter is chosen', () => {
  render(<TaskFilters filters={empty} projects={[]} onChange={() => {}} onClear={() => {}} />)
  expect(screen.getByRole('button', { name: /clear filters/i })).toBeDisabled()
})

test('choosing a status calls onChange with that value', async () => {
  const onChange = vi.fn()
  render(<TaskFilters filters={empty} projects={[]} onChange={onChange} onClear={() => {}} />)
  await userEvent.selectOptions(screen.getByLabelText(/status/i), 'done')
  expect(onChange).toHaveBeenCalledWith({ ...empty, status: 'done' })
})