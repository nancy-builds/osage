import PaymentPage from "../../../components/PaymentPage"

export default async function Payment({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  return (
    <PaymentPage
      orderId={orderId}
    />
  )
}
