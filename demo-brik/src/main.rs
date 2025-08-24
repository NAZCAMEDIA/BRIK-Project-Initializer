use demo_brik::core;

fn app_main() {
    println!("BRIK System Initialized");
    let s = core::add(1,1);
    println!("1+1={}", s);
}

#[cfg(not(tarpaulin))]
fn main() {
    app_main();
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn cover_main() { app_main(); }
}
