import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/log/')({
  component: () => <div>Hello /log/!</div>
})